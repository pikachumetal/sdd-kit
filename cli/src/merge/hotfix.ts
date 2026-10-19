import { basename } from 'node:path';
import { DomainError, UsageError } from '../cli/args.ts';
import { git, gitLines } from '../git/git.ts';
import { checkDestination, withDestination, type DestinationRequest } from './destination.ts';
import type { Job } from './run.ts';
import { mergeFeature, remoteForBranch, remoteMoved, shortHead, syncBaseBranch, undoFailedMerge } from './steps.ts';
import { MergeConflict } from './attempt.ts';
import { explainFailure, verifyMerge } from './verify.ts';

export interface HotfixTarget {
  into: string;
  tag: string | null;
  order: string;
  remote: string | null;
}

export interface HotfixPlan extends HotfixTarget {
  back: string;
}

interface Checkouts {
  stable: string;
  back: string;
}

const GIT_FLOW = /^(hotfix|release)\//;

async function stableRef(root: string, { into, remote }: HotfixTarget): Promise<string> {
  const tracking = `refs/remotes/${remote}/${into}`;
  if (remote !== null && (await git(root, ['rev-parse', '--verify', '--quiet', tracking])).code === 0) return tracking;
  return `refs/heads/${into}`;
}

async function openReleases(root: string, target: HotfixTarget, branch: string): Promise<string[]> {
  const prefix = target.remote === null ? 'refs/heads/' : `refs/remotes/${target.remote}/`;
  const stable = await stableRef(root, target);
  const open: string[] = [];
  for (const ref of await gitLines(root, ['for-each-ref', '--format=%(refname)', `${prefix}release/`])) {
    const name = ref.slice(prefix.length);
    if (name !== branch && (await git(root, ['merge-base', '--is-ancestor', ref, stable])).code !== 0) open.push(name);
  }
  return open.sort();
}

async function backTarget(root: string, job: Job, target: HotfixTarget): Promise<string> {
  if (!job.branch.startsWith('hotfix/')) return job.policy.into;
  const releases = await openReleases(root, target, job.branch);
  if (releases.length > 1) throw new DomainError(`vuelta: hay varias ramas release/ abiertas (${releases.join(', ')}); fusiona a mano`);
  return releases[0] ?? job.policy.into;
}

const remoteName = (remote: string | null) => (remote === null ? 'sin remoto' : `'${remote}'`);

async function decideBack(root: string, job: Job, target: HotfixTarget): Promise<HotfixPlan> {
  const back = await backTarget(root, job, target);
  const backRemote = await remoteForBranch(root, back);
  if (backRemote !== target.remote) {
    throw new DomainError(`push: '${target.into}' y '${back}' tienen remotos distintos (${remoteName(target.remote)}, ${remoteName(backRemote)}); fusiona a mano`);
  }
  return { ...target, back };
}

async function assertTagFree(root: string, { tag, remote }: HotfixTarget): Promise<void> {
  if (tag === null) return;
  if ((await git(root, ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`])).code === 0) throw new DomainError(`--tag: ya existe '${tag}'`);
  if (remote === null) return;
  const listed = await git(root, ['ls-remote', '--tags', remote, `refs/tags/${tag}`]);
  if (listed.code !== 0) throw new DomainError(`--tag: no se pudo consultar las etiquetas de '${remote}'`);
  if (listed.stdout.trim() !== '') throw new DomainError(`--tag: ya existe '${tag}' en '${remote}'`);
}

export async function prepareHotfix(job: Job, into: string, order: string): Promise<HotfixTarget> {
  const { projectRoot, branch, options } = job;
  const { tag } = options;
  if (tag !== null && (await git(projectRoot, ['check-ref-format', `refs/tags/${tag}`])).code !== 0) throw new UsageError(`--tag: '${tag}' no es un nombre de etiqueta válido`);
  if (!GIT_FLOW.test(branch)) throw new DomainError(`--into: a '${into}' solo llegan ramas hotfix/ o release/ (git-flow); '${branch}' no lo es`);
  const target = { into, tag, order, remote: await remoteForBranch(projectRoot, into) };
  await assertTagFree(projectRoot, target);
  return target;
}

function destination(job: Job, into: string, suffix: string): DestinationRequest {
  const { projectRoot, branch, io } = job;
  return { projectRoot, into, branch, warn: io.err, folder: `merge-${basename(branch)}${suffix}` };
}

const stableDestination = (job: Job, plan: HotfixPlan) => destination(job, plan.into, '');
const backDestination = (job: Job, plan: HotfixPlan) => destination(job, plan.back, `-${basename(plan.back)}`);

export async function checkHotfix(job: Job, target: HotfixTarget): Promise<void> {
  const plan = await decideBack(job.projectRoot, job, target);
  for (const request of [stableDestination(job, plan), backDestination(job, plan)]) job.io.out(await checkDestination(request));
}

async function mergeStable(path: string, job: Job, plan: HotfixPlan): Promise<boolean> {
  await mergeFeature(path, { branch: job.branch, into: plan.into, noFf: true, order: plan.order }, job.io.out);
  await verifyMerge(path, { command: job.options.verify, verifiedAt: job.verifiedAt }, job.io);
  if (plan.tag === null) return false;
  if ((await git(path, ['tag', '-a', plan.tag, '-m', `${plan.tag} — ${job.branch}`])).code !== 0) throw new DomainError(`--tag: no se pudo crear '${plan.tag}'`);
  return true;
}

async function mergeBack(path: string, job: Job, plan: HotfixPlan): Promise<void> {
  try {
    await mergeFeature(path, { branch: job.branch, into: plan.back, noFf: true, order: plan.order }, job.io.out);
  } catch (error) {
    if (!(error instanceof MergeConflict)) throw error;
    const undone = plan.tag === null ? `el merge en '${plan.into}'` : `el merge en '${plan.into}' y la etiqueta`;
    throw new DomainError(`vuelta: conflicto en ${error.files.join(', ')}; se deshacen ${undone}: porta el arreglo a '${plan.back}' a mano`);
  }
  await verifyMerge(path, { command: job.options.verify, verifiedAt: job.verifiedAt }, job.io);
}

async function pushAll(path: string, plan: HotfixPlan, remote: string): Promise<void> {
  const refs = [`refs/heads/${plan.into}`, `refs/heads/${plan.back}`, ...(plan.tag === null ? [] : [`refs/tags/${plan.tag}`])];
  if ((await git(path, ['push', '--atomic', remote, ...refs.map((ref) => `${ref}:${ref}`)])).code === 0) return;
  const moved = (await remoteMoved(path, remote, plan.into)) || (await remoteMoved(path, remote, plan.back));
  // ponytail: sin bucle de reintentos, al contrario que el merge normal; añadirlo si un hotfix lo sufre en campo.
  if (moved) throw new DomainError(`push: '${plan.into}' o '${plan.back}' avanzó en '${remote}'; relanza el hotfix`);
  throw new DomainError(`push: no se pudo publicar '${plan.into}' y '${plan.back}' en '${remote}'.`);
}

async function report(job: Job, plan: HotfixPlan, { tagged, ...paths }: Checkouts & { tagged: boolean }): Promise<void> {
  const { branch, options, io } = job;
  const stableHash = await shortHead(paths.stable);
  io.out(`Fusionado ${branch} en ${plan.into}: ${stableHash}`);
  if (tagged) io.out(`etiqueta ${plan.tag} en ${stableHash}`);
  io.out(`Fusionado ${branch} en ${plan.back}: ${await shortHead(paths.back)}`);
  if (options.push) io.out(plan.remote === null ? 'push: no hecho: sin remoto' : `publicado en ${plan.remote}`);
}

export async function publishedBack(path: string, { back, remote }: HotfixPlan): Promise<boolean> {
  if (remote === null) return false;
  const { code } = await git(path, ['ls-remote', '--exit-code', '--heads', remote, back]);
  if (code !== 0 && code !== 2) throw new DomainError(`vuelta: no se pudo consultar '${back}' en '${remote}'`);
  return code === 0;
}

async function integrateHotfix(job: Job, plan: HotfixPlan, paths: Checkouts): Promise<void> {
  const published = await publishedBack(paths.back, plan);
  await syncBaseBranch(paths.back, { into: plan.back, remote: published ? plan.remote : null }, job.io.out);
  const [stableBefore] = await gitLines(paths.stable, ['rev-parse', 'HEAD']);
  const [backBefore] = await gitLines(paths.back, ['rev-parse', 'HEAD']);
  let failedAt = paths.stable;
  let tagged = false;
  try {
    tagged = await mergeStable(paths.stable, job, plan);
    failedAt = paths.back;
    await mergeBack(paths.back, job, plan);
    if (job.options.push && plan.remote !== null) await pushAll(paths.stable, plan, plan.remote);
    await report(job, plan, { ...paths, tagged });
  } catch (error) {
    await undoFailedMerge(paths.back, backBefore);
    await undoFailedMerge(paths.stable, stableBefore);
    if (tagged && plan.tag !== null) await git(paths.stable, ['tag', '-d', plan.tag]);
    throw await explainFailure(error, { worktree: failedAt, command: job.options.verify, io: job.io });
  }
}

async function fetchStableAndReleases(root: string, { into, remote }: HotfixTarget): Promise<void> {
  if (remote === null) return;
  const refspecs = [`+refs/heads/${into}:refs/remotes/${remote}/${into}`, `+refs/heads/release/*:refs/remotes/${remote}/release/*`];
  if ((await git(root, ['fetch', '--prune', remote, ...refspecs])).code !== 0) throw new DomainError(`vuelta: no se pudo hacer fetch de las release/ de '${remote}'`);
}

// La vuelta se decide antes de tocar nada, con la rama estable y las release/ recién traídas del remoto: una release cerrada fuera no la recibe.
export async function mergeHotfix(job: Job, target: HotfixTarget): Promise<void> {
  await fetchStableAndReleases(job.projectRoot, target);
  const plan = await decideBack(job.projectRoot, job, target);
  await withDestination(stableDestination(job, plan), async (stable) => {
    await syncBaseBranch(stable, { into: plan.into, remote: plan.remote }, job.io.out);
    await withDestination(backDestination(job, plan), (back) => integrateHotfix(job, plan, { stable, back }));
  });
}
