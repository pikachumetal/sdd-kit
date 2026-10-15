import { DomainError } from '../cli/args.ts';
import { git } from '../git/git.ts';
import { completeMergeAttempt, gitWithOutput } from './attempt.ts';
import type { MergePolicy } from './policy.ts';

export async function remoteForBranch(worktree: string, into: string): Promise<string | null> {
  const configured = await git(worktree, ['config', '--get', `branch.${into}.remote`]);
  const remote = configured.code === 0 ? configured.stdout.split(/\r?\n/)[0].trim() : '';
  if (remote !== '') return remote;
  const remotes = (await git(worktree, ['remote'])).stdout.split(/\r?\n/);
  return remotes.includes('origin') ? 'origin' : null;
}

export async function syncBaseBranch(worktree: string, into: string, remote: string | null): Promise<void> {
  if (remote === null) return;
  const fetched = await git(worktree, ['fetch', remote, `+refs/heads/${into}:refs/remotes/${remote}/${into}`]);
  if (fetched.code !== 0) throw new DomainError(`base: no se pudo hacer fetch de '${remote}'.`);
  const remoteRef = `${remote}/${into}`;
  if ((await git(worktree, ['merge-base', '--is-ancestor', remoteRef, 'HEAD'])).code === 0) return;
  if ((await git(worktree, ['merge', '--ff-only', remoteRef])).code === 0) return;
  const merged = await gitWithOutput(worktree, ['merge', '--no-edit', remoteRef]);
  await completeMergeAttempt({ worktree, stepName: 'base', output: merged.output }, merged.code);
}

export async function mergeFeature(worktree: string, branch: string, target: MergePolicy, order: string | null = null): Promise<void> {
  const flags = target.noFf ? ['--no-ff'] : [];
  const orderLine = order === null ? [] : ['-m', `Orden del dev-lead: «${order}»`];
  const message = ['-m', `merge: ${branch} en ${target.into}`, ...orderLine, '-m', 'Fusión hecha con sdd merge (sdd-kit).'];
  const merged = await gitWithOutput(worktree, ['merge', ...flags, ...message, branch]);
  await completeMergeAttempt({ worktree, stepName: 'merge', output: merged.output }, merged.code);
}

export async function remoteMoved(worktree: string, remote: string, branch: string): Promise<boolean> {
  const fetched = await git(worktree, ['fetch', remote, `+refs/heads/${branch}:refs/remotes/${remote}/${branch}`]);
  return fetched.code === 0 && (await git(worktree, ['merge-base', '--is-ancestor', `${remote}/${branch}`, `refs/heads/${branch}`])).code !== 0;
}

export async function pushDestination(worktree: string, remote: string, into: string): Promise<'pushed' | 'moved'> {
  if ((await git(worktree, ['push', remote, `refs/heads/${into}:refs/heads/${into}`])).code === 0) return 'pushed';
  if (await remoteMoved(worktree, remote, into)) return 'moved';
  throw new DomainError(`push: no se pudo publicar '${into}' en '${remote}'.`);
}

export async function undoFailedMerge(worktree: string, before: string): Promise<void> {
  await git(worktree, ['merge', '--abort']);
  await git(worktree, ['reset', '--hard', before]);
}
