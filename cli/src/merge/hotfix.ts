import { basename } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { git, gitLines } from '../git/git.ts';
import { checkDestination, withDestination, type DestinationRequest } from './destination.ts';
import type { Job } from './run.ts';
import { mergeFeature, remoteForBranch, remoteMoved, syncBaseBranch, undoFailedMerge } from './steps.ts';
import { explainFailure, verifyMerge } from './verify.ts';

export interface HotfixPlan {
  into: string;
  back: string;
  tag: string | null;
  order: string;
  remote: string | null;
}

interface Checkouts {
  stable: string;
  back: string;
}

const GIT_FLOW = /^(hotfix|release)\//;
const MERGE_CONFLICT = /^merge: conflicto en (.+)\.$/;

async function openReleases(root: string, plan: HotfixPlan, branch: string): Promise<string[]> {
  const remotePrefix = `refs/remotes/${plan.remote}/`;
  const refs = await gitLines(root, ['for-each-ref', '--format=%(refname)', 'refs/heads/release/', ...(plan.remote === null ? [] : [`${remotePrefix}release/`])]);
  const open = new Set<string>();
  for (const ref of refs) {
    const name = ref.startsWith('refs/heads/') ? ref.slice('refs/heads/'.length) : ref.slice(remotePrefix.length);
    if (name !== branch && (await git(root, ['merge-base', '--is-ancestor', ref, `refs/heads/${plan.into}`])).code !== 0) open.add(name);
  }
  return [...open].sort();
}

async function backTarget(root: string, job: Job, plan: HotfixPlan): Promise<string> {
  if (!job.branch.startsWith('hotfix/')) return job.policy.into;
  const releases = await openReleases(root, plan, job.branch);
  if (releases.length > 1) throw new DomainError(`vuelta: hay varias ramas release/ abiertas (${releases.join(', ')}); fusiona a mano`);
  return releases[0] ?? job.policy.into;
}

export async function prepareHotfix(job: Job, into: string, order: string): Promise<HotfixPlan> {
  const { projectRoot, branch, options } = job;
  if (!GIT_FLOW.test(branch)) throw new DomainError(`--into: a '${into}' solo llegan ramas hotfix/ o release/ (git-flow); '${branch}' no lo es`);
  const { tag } = options;
  if (tag !== null && (await git(projectRoot, ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`])).code === 0) {
    throw new DomainError(`--tag: ya existe '${tag}'`);
  }
  const plan = { into, back: '', tag, order, remote: await remoteForBranch(projectRoot, into) };
  return { ...plan, back: await backTarget(projectRoot, job, plan) };
}

function destination(job: Job, into: string, suffix: string): DestinationRequest {
  const { projectRoot, branch, io } = job;
  return { projectRoot, into, branch, warn: io.err, folder: `merge-${basename(branch)}${suffix}` };
}

const stableDestination = (job: Job, plan: HotfixPlan) => destination(job, plan.into, '');
const backDestination = (job: Job, plan: HotfixPlan) => destination(job, plan.back, `-${basename(plan.back)}`);

export async function checkHotfix(job: Job, plan: HotfixPlan): Promise<void> {
  for (const request of [stableDestination(job, plan), backDestination(job, plan)]) job.io.out(await checkDestination(request));
}

async function mergeStable(path: string, job: Job, plan: HotfixPlan): Promise<boolean> {
  await mergeFeature(path, job.branch, { into: plan.into, noFf: true }, plan.order);
  await verifyMerge(path, job.options.verify, job.verifiedAt, job.io);
  if (plan.tag === null) return false;
  if ((await git(path, ['tag', '-a', plan.tag, '-m', `${plan.tag} — ${job.branch}`])).code !== 0) throw new DomainError(`--tag: no se pudo crear '${plan.tag}'`);
  return true;
}

async function mergeBack(path: string, job: Job, plan: HotfixPlan): Promise<void> {
  try {
    await mergeFeature(path, job.branch, { into: plan.back, noFf: true }, plan.order);
  } catch (error) {
    const files = error instanceof DomainError ? MERGE_CONFLICT.exec(error.message)?.[1] : undefined;
    if (files === undefined) throw error;
    const undone = plan.tag === null ? `el merge en '${plan.into}'` : `el merge en '${plan.into}' y la etiqueta`;
    throw new DomainError(`vuelta: conflicto en ${files}; se deshacen ${undone}: porta el arreglo a '${plan.back}' a mano`);
  }
  await verifyMerge(path, job.options.verify, job.verifiedAt, job.io);
}

async function pushAll(path: string, plan: HotfixPlan, remote: string): Promise<void> {
  const refs = [`refs/heads/${plan.into}`, `refs/heads/${plan.back}`, ...(plan.tag === null ? [] : [`refs/tags/${plan.tag}`])];
  if ((await git(path, ['push', '--atomic', remote, ...refs.map((ref) => `${ref}:${ref}`)])).code === 0) return;
  const moved = (await remoteMoved(path, remote, plan.into)) || (await remoteMoved(path, remote, plan.back));
  // ponytail: sin bucle de reintentos, al contrario que el merge normal; añadirlo si un hotfix lo sufre en campo.
  if (moved) throw new DomainError(`push: '${plan.into}' o '${plan.back}' avanzó en '${remote}'; relanza el hotfix`);
  throw new DomainError(`push: no se pudo publicar '${plan.into}' y '${plan.back}' en '${remote}'.`);
}

const shortHead = async (path: string) => (await gitLines(path, ['rev-parse', '--short', 'HEAD']))[0];

async function report(job: Job, plan: HotfixPlan, paths: Checkouts, tagged: boolean): Promise<void> {
  const { branch, options, io } = job;
  const stableHash = await shortHead(paths.stable);
  io.out(`Fusionado ${branch} en ${plan.into}: ${stableHash}`);
  if (tagged) io.out(`etiqueta ${plan.tag} en ${stableHash}`);
  io.out(`Fusionado ${branch} en ${plan.back}: ${await shortHead(paths.back)}`);
  if (options.push) io.out(plan.remote === null ? 'push: no hecho: sin remoto' : `publicado en ${plan.remote}`);
}

async function integrateHotfix(job: Job, plan: HotfixPlan, paths: Checkouts): Promise<void> {
  const backPublished = plan.remote !== null && (await git(paths.back, ['ls-remote', '--exit-code', '--heads', plan.remote, plan.back])).code === 0;
  await syncBaseBranch(paths.back, plan.back, backPublished ? plan.remote : null);
  const [stableBefore] = await gitLines(paths.stable, ['rev-parse', 'HEAD']);
  const [backBefore] = await gitLines(paths.back, ['rev-parse', 'HEAD']);
  let failedAt = paths.stable;
  let tagged = false;
  try {
    tagged = await mergeStable(paths.stable, job, plan);
    failedAt = paths.back;
    await mergeBack(paths.back, job, plan);
    if (job.options.push && plan.remote !== null) await pushAll(paths.stable, plan, plan.remote);
    await report(job, plan, paths, tagged);
  } catch (error) {
    await undoFailedMerge(paths.back, backBefore);
    await undoFailedMerge(paths.stable, stableBefore);
    if (tagged && plan.tag !== null) await git(paths.stable, ['tag', '-d', plan.tag]);
    throw await explainFailure(error, job.options.verify, failedAt, job.io);
  }
}

// La vuelta se decide con la rama estable ya integrada y las release/ del remoto al día: una release cerrada fuera no la recibe.
export async function mergeHotfix(job: Job, prepared: HotfixPlan): Promise<void> {
  await withDestination(stableDestination(job, prepared), async (stable) => {
    await syncBaseBranch(stable, prepared.into, prepared.remote);
    if (prepared.remote !== null) await git(stable, ['fetch', prepared.remote, `+refs/heads/release/*:refs/remotes/${prepared.remote}/release/*`]);
    const plan = { ...prepared, back: await backTarget(stable, job, prepared) };
    await withDestination(backDestination(job, plan), (back) => integrateHotfix(job, plan, { stable, back }));
  });
}
