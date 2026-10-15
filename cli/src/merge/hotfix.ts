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

async function openReleases(root: string, into: string, remote: string | null, branch: string): Promise<string[]> {
  const remotePrefix = `refs/remotes/${remote}/`;
  const refs = await gitLines(root, ['for-each-ref', '--format=%(refname)', 'refs/heads/release/', ...(remote === null ? [] : [`${remotePrefix}release/`])]);
  const open = new Set<string>();
  for (const ref of refs) {
    const name = ref.startsWith('refs/heads/') ? ref.slice('refs/heads/'.length) : ref.slice(remotePrefix.length);
    if (name !== branch && (await git(root, ['merge-base', '--is-ancestor', ref, into])).code !== 0) open.add(name);
  }
  return [...open].sort();
}

export async function prepareHotfix(job: Job, into: string, order: string): Promise<HotfixPlan> {
  const { projectRoot, branch, policy, options } = job;
  if (!GIT_FLOW.test(branch)) throw new DomainError(`--into: a '${into}' solo llegan ramas hotfix/ o release/ (git-flow); '${branch}' no lo es`);
  const { tag } = options;
  if (tag !== null && (await git(projectRoot, ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`])).code === 0) {
    throw new DomainError(`--tag: ya existe '${tag}'`);
  }
  const remote = await remoteForBranch(projectRoot, into);
  const releases = branch.startsWith('hotfix/') ? await openReleases(projectRoot, into, remote, branch) : [];
  if (releases.length > 1) throw new DomainError(`vuelta: hay varias ramas release/ abiertas (${releases.join(', ')}); fusiona a mano`);
  return { into, back: releases[0] ?? policy.into, tag, order, remote };
}

function destinations(job: Job, plan: HotfixPlan): [DestinationRequest, DestinationRequest] {
  const { projectRoot, branch, io } = job;
  const folder = `merge-${basename(branch)}`;
  return [
    { projectRoot, into: plan.into, branch, warn: io.err, folder },
    { projectRoot, into: plan.back, branch, warn: io.err, folder: `${folder}-${basename(plan.back)}` },
  ];
}

export async function checkHotfix(job: Job, plan: HotfixPlan): Promise<void> {
  for (const request of destinations(job, plan)) job.io.out(await checkDestination(request));
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

async function integrateHotfix(job: Job, plan: HotfixPlan, paths: Checkouts): Promise<void> {
  const { branch, options, verifiedAt, io } = job;
  await syncBaseBranch(paths.stable, plan.into, plan.remote);
  const backPublished = plan.remote !== null && (await git(paths.back, ['ls-remote', '--exit-code', '--heads', plan.remote, plan.back])).code === 0;
  await syncBaseBranch(paths.back, plan.back, backPublished ? plan.remote : null);
  const [stableBefore] = await gitLines(paths.stable, ['rev-parse', 'HEAD']);
  const [backBefore] = await gitLines(paths.back, ['rev-parse', 'HEAD']);
  let failedAt = paths.stable;
  let tagged = false;
  try {
    await mergeFeature(paths.stable, branch, { into: plan.into, noFf: true }, plan.order);
    await verifyMerge(paths.stable, options.verify, verifiedAt, io);
    if (plan.tag !== null) tagged = (await git(paths.stable, ['tag', '-a', plan.tag, '-m', `${plan.tag} — ${branch}`])).code === 0;
    failedAt = paths.back;
    await mergeBack(paths.back, job, plan);
    await verifyMerge(paths.back, options.verify, verifiedAt, io);
    const pushed = options.push && plan.remote !== null;
    if (pushed) await pushAll(paths.stable, plan, plan.remote as string);
    const stableHash = await shortHead(paths.stable);
    io.out(`Fusionado ${branch} en ${plan.into}: ${stableHash}`);
    if (tagged) io.out(`etiqueta ${plan.tag} en ${stableHash}`);
    io.out(`Fusionado ${branch} en ${plan.back}: ${await shortHead(paths.back)}`);
    if (pushed) io.out(`publicado en ${plan.remote}`);
    else if (options.push) io.out('push: no hecho: sin remoto');
  } catch (error) {
    await undoFailedMerge(paths.back, backBefore);
    await undoFailedMerge(paths.stable, stableBefore);
    if (tagged) await git(paths.stable, ['tag', '-d', plan.tag as string]);
    throw await explainFailure(error, options.verify, failedAt, io);
  }
}

export async function mergeHotfix(job: Job, plan: HotfixPlan): Promise<void> {
  const [stable, back] = destinations(job, plan);
  await withDestination(stable, (stablePath) => withDestination(back, (backPath) => integrateHotfix(job, plan, { stable: stablePath, back: backPath })));
}
