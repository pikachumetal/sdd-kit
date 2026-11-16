import { gitLines } from '../git/git.ts';
import { BRANCH_CHANGE_FOLDERS, BRANCH_ROADMAPS, SPEC_FOLDER_ID, branchContentIds, rowIds } from './scan.ts';

export interface Reservation {
  commit: string;
  ids: string[];
}

function changedRowIds(diff: string[], sign: '+' | '-'): string[] {
  return rowIds(diff.filter((line) => line.startsWith(`${sign}|`)).map((line) => line.slice(1)));
}

async function addedRowIds(worktree: string, sha: string): Promise<string[]> {
  const diff = await gitLines(worktree, ['show', '--format=', '--unified=0', sha, '--', ...BRANCH_ROADMAPS]);
  const removed = new Set(changedRowIds(diff, '-'));
  return changedRowIds(diff, '+').filter((id) => !removed.has(id));
}

async function addedFolderIds(worktree: string, sha: string): Promise<string[]> {
  const files = await gitLines(worktree, ['show', '--format=', '--name-only', '--diff-filter=A', sha, '--', ...BRANCH_CHANGE_FOLDERS]);
  return files.flatMap((file) => SPEC_FOLDER_ID.exec(file)?.[1] ?? []);
}

export async function unpublishedReservations(worktree: string, remoteRef: string, into: string): Promise<Reservation[]> {
  const commits = await gitLines(worktree, ['log', '--no-merges', '--format=%h %s', `${remoteRef}..${into}`]);
  const reservations: Reservation[] = [];
  for (const commit of commits) {
    const sha = commit.split(' ')[0]!;
    const ids = [...(await addedRowIds(worktree, sha)), ...(await addedFolderIds(worktree, sha))];
    reservations.push({ commit, ids: [...new Set(ids)] });
  }
  return reservations;
}

export async function refIds(worktree: string, ref: string): Promise<Set<string>> {
  return new Set(await branchContentIds(worktree, ref));
}
