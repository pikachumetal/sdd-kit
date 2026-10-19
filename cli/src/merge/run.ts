import { resolve } from 'node:path';
import { existsSync, realpathSync } from 'node:fs';
import { DomainError, UsageError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { commonDir, gitLines } from '../git/git.ts';
import { withLock } from '../git/lock.ts';
import { checkDestination, withDestination } from './destination.ts';
import { checkHotfix, mergeHotfix, prepareHotfix } from './hotfix.ts';
import { resolveMergePolicy, type MergePolicy } from './policy.ts';
import { mergeFeature, pushDestination, remoteForBranch, shortHead, syncBaseBranch, undoFailedMerge } from './steps.ts';
import { explainFailure, resolveCommit, verifyMerge } from './verify.ts';

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

const PUSH_ATTEMPTS = 3;

async function publish(path: string, job: Job, remote: string): Promise<void> {
  const { policy, options, io } = job;
  for (let attempt = 1; (await pushDestination(path, remote, policy.into)) === 'moved'; attempt++) {
    if (attempt === PUSH_ATTEMPTS) throw new DomainError(`push: '${policy.into}' sigue moviéndose en '${remote}' tras ${PUSH_ATTEMPTS} intentos; relanza el merge en un rato`);
    io.out(`push: '${policy.into}' avanzó en '${remote}'; integro y reintento (${attempt + 1}/${PUSH_ATTEMPTS})`);
    const [verified] = await gitLines(path, ['rev-parse', 'HEAD']);
    await syncBaseBranch(path, { into: policy.into, remote }, io.out);
    await verifyMerge(path, { command: options.verify, verifiedAt: verified }, io);
  }
}

async function reportMerge(path: string, { branch, policy, options, io }: Job, pushedTo: string | null): Promise<void> {
  io.out(`Fusionado ${branch} en ${policy.into}: ${await shortHead(path)}`);
  if (pushedTo !== null) io.out(`publicado en ${pushedTo}`);
  else if (options.push) io.out('push: no hecho: sin remoto');
}

async function integrate(path: string, job: Job): Promise<void> {
  const { branch, policy, options, io } = job;
  const remote = await remoteForBranch(path, policy.into);
  await syncBaseBranch(path, { into: policy.into, remote }, io.out);
  const [before] = await gitLines(path, ['rev-parse', 'HEAD']);
  try {
    await mergeFeature(path, { branch, into: policy.into, noFf: policy.noFf, order: options.order }, io.out);
    await verifyMerge(path, { command: options.verify, verifiedAt: job.verifiedAt }, io);
    const pushedTo = options.push ? remote : null;
    if (pushedTo !== null) await publish(path, job, pushedTo);
    await reportMerge(path, job, pushedTo);
  } catch (error) {
    await undoFailedMerge(path, before);
    throw await explainFailure(error, { worktree: path, command: options.verify, io });
  }
}

async function currentBranch(root: string, requested: string | null): Promise<string> {
  if (requested !== null && requested.trim() !== '') return requested;
  return (await gitLines(root, ['branch', '--show-current']))[0] ?? '';
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

export async function mergeBranch(options: MergeOptions, io: Io): Promise<void> {
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
  const request = { projectRoot, into: policy.into, branch, warn: io.err };
  if (options.check) return io.out(await checkDestination(request));
  await withLock(lock, options.lockTimeoutMinutes, () => withDestination(request, (path) => integrate(path, job)));
}
