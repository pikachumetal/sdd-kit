import { DomainError } from '../cli/args.ts';
import { git, gitLines } from '../git/git.ts';
import { completeMergeAttempt, gitWithOutput, mergeArgs, type MergeAttempt } from './attempt.ts';
import { cleanRegistries } from './cleanup.ts';

export type Report = (line: string) => void;

export interface BaseSync {
  into: string;
  remote: string | null;
}

export interface FeatureMerge {
  branch: string;
  into: string;
  noFf: boolean;
  order: string | null;
}

export async function remoteForBranch(worktree: string, into: string): Promise<string | null> {
  const configured = await git(worktree, ['config', '--get', `branch.${into}.remote`]);
  const remote = configured.code === 0 ? configured.stdout.split(/\r?\n/)[0].trim() : '';
  if (remote !== '') return remote;
  const remotes = (await git(worktree, ['remote'])).stdout.split(/\r?\n/);
  return remotes.includes('origin') ? 'origin' : null;
}

export async function fetchBase(worktree: string, { into, remote }: BaseSync): Promise<string> {
  if (remote === null) return into;
  const fetched = await git(worktree, ['fetch', remote, `+refs/heads/${into}:refs/remotes/${remote}/${into}`]);
  if (fetched.code !== 0) throw new DomainError(`base: no se pudo hacer fetch de '${remote}'.`);
  return `${remote}/${into}`;
}

export const shortHead = async (worktree: string) => (await gitLines(worktree, ['rev-parse', '--short', 'HEAD']))[0];

export async function mergeAndClean(attempt: Omit<MergeAttempt, 'output'>, args: string[]): Promise<void> {
  const [before] = await gitLines(attempt.worktree, ['rev-parse', 'HEAD']);
  const merged = await gitWithOutput(attempt.worktree, mergeArgs(args));
  await completeMergeAttempt({ ...attempt, output: merged.output }, merged.code);
  try {
    await cleanRegistries(attempt.worktree, attempt.mergedDestination ?? before, attempt.report);
  } catch (error) {
    await undoFailedMerge(attempt.worktree, before);
    throw error;
  }
}

export async function assertNothingPending(root: string, branch: string): Promise<void> {
  const changed = (await gitLines(root, ['status', '--porcelain', '--untracked-files=no'])).length > 0;
  const merging = (await git(root, ['rev-parse', '--verify', '--quiet', 'MERGE_HEAD'])).code === 0;
  if (changed || merging) throw new DomainError(`base: '${branch}' tiene cambios sin commitear; commitéalos antes de integrar la base`);
}

export async function integrateRef(root: string, ref: string, report: Report): Promise<boolean> {
  if ((await git(root, ['merge-base', '--is-ancestor', ref, 'HEAD'])).code === 0) return false;
  await mergeAndClean({ worktree: root, stepName: 'base', report, mergedDestination: ref }, ['--no-edit', ref]);
  const [branch] = await gitLines(root, ['branch', '--show-current']);
  report(`base: integrada '${ref}' en '${branch}': ${await shortHead(root)}`);
  return true;
}

export async function syncBaseBranch(worktree: string, base: BaseSync, report: Report): Promise<void> {
  if (base.remote === null) return;
  const remoteRef = await fetchBase(worktree, base);
  if ((await git(worktree, ['merge-base', '--is-ancestor', remoteRef, 'HEAD'])).code === 0) return;
  if ((await git(worktree, ['merge', '--ff-only', remoteRef])).code === 0) return;
  await mergeAndClean({ worktree, stepName: 'base', report }, ['--no-edit', remoteRef]);
}

export async function branchMergeBase(worktree: string, branch: string): Promise<string> {
  const [base] = await gitLines(worktree, ['merge-base', 'HEAD', branch]);
  if (base === undefined) throw new DomainError(`merge: '${branch}' no tiene historia común con el destino`);
  return base;
}

export async function mergeFeature(worktree: string, { branch, into, noFf, order }: FeatureMerge, report: Report): Promise<void> {
  const flags = noFf ? ['--no-ff'] : [];
  const orderLine = order === null ? [] : ['-m', `Orden del dev-lead: «${order}»`];
  const message = ['-m', `merge: ${branch} en ${into}`, ...orderLine, '-m', 'Fusión hecha con sdd merge (sdd-kit).'];
  await mergeAndClean({ worktree, stepName: 'merge', report }, [...flags, ...message, branch]);
}

export async function unpublishedCommits(worktree: string, remote: string | null, into: string): Promise<string[]> {
  if (remote === null) return [];
  return gitLines(worktree, ['log', '--format=%h %s', `refs/remotes/${remote}/${into}..refs/heads/${into}`]);
}

export function unpublishedLines(into: string, branch: string, commits: string[]): string[] {
  if (commits.length === 0) return [];
  const header = commits.length === 1 ? `1 commit de '${into}' que no es de ${branch}:` : `${commits.length} commits de '${into}' que no son de ${branch}:`;
  return [`push: también publica ${header}`, ...commits.map((commit) => `- ${commit}`)];
}

export async function remoteMoved(worktree: string, remote: string, branch: string): Promise<boolean> {
  const fetched = await git(worktree, ['fetch', remote, `+refs/heads/${branch}:refs/remotes/${remote}/${branch}`]);
  return fetched.code === 0 && (await git(worktree, ['merge-base', '--is-ancestor', `${remote}/${branch}`, `refs/heads/${branch}`])).code !== 0;
}

export const appendGitError = (message: string, stderr: string) => (stderr.trim() === '' ? message : `${message}\n${stderr.trim()}`);

export async function pushDestination(worktree: string, remote: string, into: string): Promise<'pushed' | 'moved'> {
  const pushed = await git(worktree, ['push', remote, `refs/heads/${into}:refs/heads/${into}`]);
  if (pushed.code === 0) return 'pushed';
  if (await remoteMoved(worktree, remote, into)) return 'moved';
  throw new DomainError(appendGitError(`push: no se pudo publicar '${into}' en '${remote}'.`, pushed.stderr));
}

export async function undoFailedMerge(worktree: string, before: string): Promise<void> {
  await git(worktree, ['merge', '--abort']);
  await git(worktree, ['reset', '--hard', before]);
}
