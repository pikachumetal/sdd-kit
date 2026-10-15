import { resolve } from 'node:path';
import { existsSync, realpathSync } from 'node:fs';
import { DomainError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { commonDir, gitLines } from '../git/git.ts';
import { withLock } from '../git/lock.ts';
import { checkDestination, withDestination } from './destination.ts';
import { resolveMergePolicy, type MergePolicy } from './policy.ts';
import { mergeFeature, pushDestination, remoteForBranch, syncBaseBranch, undoFailedMerge } from './steps.ts';
import { onlyDocsSince, resolveCommit, runVerification } from './verify.ts';

export interface MergeOptions {
  projectRoot: string;
  branch: string | null;
  push: boolean;
  check: boolean;
  verify: string | null;
  verifiedAt: string | null;
  lockTimeoutMinutes: number;
}

interface Job {
  branch: string;
  policy: MergePolicy;
  options: MergeOptions;
  verifiedAt: string | null;
  io: Io;
}

async function verifyMerge(path: string, job: Job): Promise<void> {
  const { options, verifiedAt, io } = job;
  if (options.verify === null || options.verify.trim() === '') return;
  if (verifiedAt !== null && (await onlyDocsSince(path, verifiedAt))) {
    const [shortHash] = await gitLines(path, ['rev-parse', '--short', verifiedAt]);
    return io.out(`verificación: omitida: desde ${shortHash} solo cambian docs`);
  }
  await runVerification({ worktree: path, command: options.verify, io });
}

async function integrate(path: string, job: Job): Promise<void> {
  const { branch, policy, options, io } = job;
  const remote = await remoteForBranch(path, policy.into);
  await syncBaseBranch(path, policy.into, remote);
  const [before] = await gitLines(path, ['rev-parse', 'HEAD']);
  try {
    await mergeFeature(path, branch, policy);
    await verifyMerge(path, job);
    const pushed = options.push && remote !== null;
    if (pushed) await pushDestination(path, remote, policy.into);
    const [shortHash] = await gitLines(path, ['rev-parse', '--short', 'HEAD']);
    io.out(`Fusionado ${branch} en ${policy.into}: ${shortHash}`);
    if (pushed) io.out(`publicado en ${remote}`);
    else if (options.push) io.out('push: no hecho: sin remoto');
  } catch (error) {
    await undoFailedMerge(path, before);
    throw error;
  }
}

async function currentBranch(root: string, requested: string | null): Promise<string> {
  if (requested !== null && requested.trim() !== '') return requested;
  return (await gitLines(root, ['branch', '--show-current']))[0] ?? '';
}

export async function mergeBranch(options: MergeOptions, io: Io): Promise<void> {
  if (!existsSync(options.projectRoot)) throw new DomainError(`No existe la ruta de proyecto '${options.projectRoot}'.`);
  const projectRoot = realpathSync.native(resolve(options.projectRoot));
  const policy = resolveMergePolicy(projectRoot);
  const branch = await currentBranch(projectRoot, options.branch);
  const lockIo = { ...io, err: io.out };
  const lock = { path: resolve(await commonDir(projectRoot), 'sdd-merge.lock'), label: 'merge', io: lockIo, owner: { branch, worktree: projectRoot } };
  const request = { projectRoot, into: policy.into, branch, warn: io.err };
  if (options.check) return io.out(await checkDestination(request));
  const verifiedAt = options.verifiedAt === null ? null : await resolveCommit(projectRoot, options.verifiedAt);
  const job: Job = { branch, policy, options, verifiedAt, io };
  await withLock(lock, options.lockTimeoutMinutes, () => withDestination(request, (path) => integrate(path, job)));
}
