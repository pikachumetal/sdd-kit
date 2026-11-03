import { resolve } from 'node:path';
import { existsSync, realpathSync } from 'node:fs';
import { DomainError, UsageError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { commonDir, gitLines } from '../git/git.ts';
import { withLock, type Lock } from '../git/lock.ts';
import { checkDestination, withDestination, type DestinationRequest } from './destination.ts';
import { checkHotfix, mergeHotfix, prepareHotfix } from './hotfix.ts';
import { resolveMergePolicy, type MergePolicy } from './policy.ts';
import {
  assertNothingPending,
  fetchBase,
  integrateRef,
  mergeFeature,
  pushDestination,
  remoteForBranch,
  shortHead,
  syncBaseBranch,
  undoFailedMerge,
  unpublishedCommits,
  unpublishedLines,
} from './steps.ts';
import { explainFailure, onlyDocsSince, parseGate, resolveCommit, verifyMerge } from './verify.ts';

export interface MergeOptions {
  projectRoot: string;
  branch: string | null;
  push: boolean;
  check: boolean;
  verify: string | null;
  verifiedAt: string | null;
  into: string | null;
  order: string | null;
  tag: string | null;
  lockTimeoutMinutes: number;
}

export interface Job {
  projectRoot: string;
  branch: string;
  policy: MergePolicy;
  options: MergeOptions;
  verifiedAt: string | null;
  io: Io;
}

interface Route {
  lock: Lock;
  destination: DestinationRequest;
  remote: string | null;
}

interface Where {
  into: string;
  remote: string | null;
}

type Outcome = 'published' | 'changed' | 'moved';

const ATTEMPTS = 3;

async function publish(path: string, { policy, io }: Job, remote: string): Promise<void> {
  for (let attempt = 1; (await pushDestination(path, remote, policy.into)) === 'moved'; attempt++) {
    if (attempt === ATTEMPTS) throw new DomainError(exhausted('moved', { into: policy.into, remote }));
    io.out(retrying('moved', { into: policy.into, remote }, attempt + 1));
    await syncBaseBranch(path, { into: policy.into, remote }, io.out);
  }
}

async function reportMerge(path: string, { branch, policy, options, io }: Job, pushed: { to: string | null; unpublished: string[] }): Promise<void> {
  io.out(`Fusionado ${branch} en ${policy.into}: ${await shortHead(path)}`);
  if (pushed.to !== null) {
    unpublishedLines(policy.into, branch, pushed.unpublished).forEach((line) => io.out(line));
    io.out(`publicado en ${pushed.to}`);
  } else if (options.push) io.out('push: no hecho: sin remoto');
}

async function integrate(path: string, job: Job): Promise<void> {
  const { branch, policy, options, io } = job;
  const remote = await remoteForBranch(path, policy.into);
  await syncBaseBranch(path, { into: policy.into, remote }, io.out);
  const [before] = await gitLines(path, ['rev-parse', 'HEAD']);
  const unpublished = options.push ? await unpublishedCommits(path, remote, policy.into) : [];
  try {
    await mergeFeature(path, { branch, into: policy.into, noFf: policy.noFf, order: options.order }, io.out);
    const pushedTo = options.push ? remote : null;
    if (pushedTo !== null) await publish(path, job, pushedTo);
    await reportMerge(path, job, { to: pushedTo, unpublished });
  } catch (error) {
    await undoFailedMerge(path, before);
    throw error;
  }
}

function retrying(outcome: Exclude<Outcome, 'published'>, { into, remote }: Where, attempt: number): string {
  if (outcome === 'moved') return `push: '${into}' avanzó en '${remote}'; integro y reintento (${attempt}/${ATTEMPTS})`;
  return `merge: '${into}' cambió durante la verificación; integro y verifico lo que se cruza (${attempt}/${ATTEMPTS})`;
}

function exhausted(outcome: Exclude<Outcome, 'published'>, { into, remote }: Where): string {
  if (outcome === 'moved') return `push: '${into}' sigue moviéndose en '${remote}' tras ${ATTEMPTS} intentos; relanza el merge en un rato`;
  return `merge: '${into}' sigue cambiando tras ${ATTEMPTS} intentos; relanza el merge en un rato`;
}

async function integrateAndVerify(job: Job, remote: string | null, verifiedAt: string | null): Promise<string> {
  const { projectRoot: root, policy, options, io } = job;
  const base = await fetchBase(root, { into: policy.into, remote });
  const [mergeBase] = await gitLines(root, ['merge-base', base, 'HEAD']);
  // Lo que toca la rama se mide hasta su punta sin la integración: lo que trae la base no es suyo.
  const [tip] = await gitLines(root, ['rev-parse', 'HEAD']);
  await integrateRef(root, base, io.out);
  if (base !== policy.into) await integrateRef(root, policy.into, io.out);
  await verifyMerge(root, { command: options.verify, verifiedAt, branch: tip, mergeBase }, io);
  return (await gitLines(root, ['rev-parse', 'HEAD']))[0];
}

interface Target {
  route: Route;
  verified: string;
  // Los de antes del primer intento: lo que trae un reintento del remoto no es del destino local.
  unpublished: string[];
}

async function mergeAndPush(path: string, job: Job, { route: { remote }, verified }: Target): Promise<Outcome> {
  const { branch, policy, options } = job;
  await mergeFeature(path, { branch, into: policy.into, noFf: policy.noFf, order: options.order }, job.io.out);
  if (!(await onlyDocsSince(path, verified))) return 'changed';
  if (options.push && remote !== null && (await pushDestination(path, remote, policy.into)) === 'moved') return 'moved';
  return 'published';
}

async function publishVerified(path: string, job: Job, target: Target): Promise<Outcome> {
  const { policy, options, io } = job;
  const { route, unpublished } = target;
  await syncBaseBranch(path, { into: policy.into, remote: route.remote }, io.out);
  const [before] = await gitLines(path, ['rev-parse', 'HEAD']);
  try {
    const outcome = await mergeAndPush(path, job, target);
    if (outcome !== 'published') await undoFailedMerge(path, before);
    else await reportMerge(path, job, { to: options.push ? route.remote : null, unpublished });
    return outcome;
  } catch (error) {
    await undoFailedMerge(path, before);
    throw error;
  }
}

async function verifyUntilPublished(job: Job, route: Route): Promise<void> {
  const { policy, options, io } = job;
  const where = { into: policy.into, remote: route.remote };
  const unpublished = options.push ? await destinationUnpublished(job, where) : [];
  let verifiedAt = job.verifiedAt;
  for (let attempt = 1; ; attempt++) {
    const verified = await integrateAndVerify(job, route.remote, verifiedAt);
    const target = { route, verified, unpublished };
    const outcome = await withLock(route.lock, options.lockTimeoutMinutes, () => withDestination(route.destination, (path) => publishVerified(path, job, target)));
    if (outcome === 'published') return;
    if (attempt === ATTEMPTS) throw new DomainError(exhausted(outcome, where));
    io.out(retrying(outcome, where, attempt + 1));
    verifiedAt = verified;
  }
}

// La verificación corre en el worktree del cambio, el único con dependencias, y fuera del cerrojo de merge.
async function mergeVerified(job: Job, route: Route): Promise<void> {
  const { projectRoot: root, branch, policy, io } = job;
  await assertNothingPending(root, branch);
  const [start] = await gitLines(root, ['rev-parse', 'HEAD']);
  try {
    await verifyUntilPublished(job, route);
  } catch (error) {
    await undoFailedMerge(root, start);
    const base = route.remote === null ? policy.into : `${route.remote}/${policy.into}`;
    throw await explainFailure(error, { worktree: root, io, base });
  }
}

async function destinationUnpublished(job: Job, where: Where): Promise<string[]> {
  if (where.remote === null) return [];
  await fetchBase(job.projectRoot, where);
  return unpublishedCommits(job.projectRoot, where.remote, where.into);
}

async function mergeIntoIntegration(job: Job, lock: Lock): Promise<void> {
  const { projectRoot, branch, policy, options, io } = job;
  const destination = { projectRoot, into: policy.into, branch, warn: io.err };
  if (options.check) return io.out(await checkDestination(destination));
  if (!hasGate(options.verify)) return withLock(lock, options.lockTimeoutMinutes, () => withDestination(destination, (path) => integrate(path, job)));
  await assertBranchCheckedOut(projectRoot, branch);
  await mergeVerified(job, { lock, destination, remote: await remoteForBranch(projectRoot, policy.into) });
}

async function currentBranch(root: string, requested: string | null): Promise<string> {
  if (requested !== null && requested.trim() !== '') return requested;
  return (await gitLines(root, ['branch', '--show-current']))[0] ?? '';
}

async function assertBranchCheckedOut(root: string, branch: string): Promise<void> {
  if ((await currentBranch(root, null)) === branch) return;
  throw new UsageError(`--verify corre en el worktree de la rama; '${branch}' no está sacada en '${root}'`);
}

function stableTarget({ into, order, tag }: MergeOptions, policy: MergePolicy): { into: string; order: string } | null {
  if (into === null || into === policy.into) {
    if (tag !== null) throw new UsageError('--tag solo con --into a la rama estable');
    return null;
  }
  if (order === null || order.trim() === '') throw new UsageError(`--into '${into}' distinta de merge.into necesita --order "<frase del dev-lead>"`);
  return { into, order };
}

export function resolveProjectRoot(path: string): string {
  if (!existsSync(path)) throw new DomainError(`No existe la ruta de proyecto '${path}'.`);
  return realpathSync.native(resolve(path));
}

const hasGate = (verify: string | null): verify is string => verify !== null && verify.trim() !== '';

export async function mergeBranch(options: MergeOptions, io: Io): Promise<void> {
  if (hasGate(options.verify)) parseGate(options.verify);
  const projectRoot = resolveProjectRoot(options.projectRoot);
  const policy = resolveMergePolicy(projectRoot);
  const stable = stableTarget(options, policy);
  const branch = await currentBranch(projectRoot, options.branch);
  const verifiedAt = options.verifiedAt === null ? null : await resolveCommit(projectRoot, options.verifiedAt);
  const job: Job = { projectRoot, branch, policy, options, verifiedAt, io };
  const lockIo = { ...io, err: io.out };
  const lock = { path: resolve(await commonDir(projectRoot), 'sdd-merge.lock'), label: 'merge', io: lockIo, owner: { branch, worktree: projectRoot } };
  if (stable !== null) {
    const plan = await prepareHotfix(job, stable.into, stable.order);
    if (options.check) return checkHotfix(job, plan);
    return withLock(lock, options.lockTimeoutMinutes, () => mergeHotfix(job, plan));
  }
  await mergeIntoIntegration(job, lock);
}
