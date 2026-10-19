import { resolve } from 'node:path';
import { gitSync, samePath } from '../git/git.ts';
import { configuredMergeInto } from '../merge/policy.ts';
import { branchStart, lastMergeTime, localBranches, worktreeOf } from './branches.ts';
import { isEmpty, readSession, type Session } from './session.ts';
import { transcriptFolders } from './transcripts.ts';
import type { TimeWindow } from './usage.ts';

export interface Repository {
  root: string;
  into: string | null;
  worktrees: Map<string, string>;
  roots: string[];
}

export interface Windowed {
  session: Session;
  folder: string;
  from: number;
  to: number;
}

export function repositoryOf(worktreePath: string, roots: string[]): Repository | null {
  const [root] = gitSync(worktreePath, ['rev-parse', '--show-toplevel']) ?? [];
  if (root === undefined) return null;
  return { root, into: configuredMergeInto(worktreePath), worktrees: worktreeOf(root), roots };
}

export const mergedAt = (repo: Repository, branch: string): number | null => (repo.into === null ? null : lastMergeTime(repo.root, branch, repo.into));

function hasOwnTranscripts(repo: Repository, branch: string): boolean {
  const path = repo.worktrees.get(branch);
  return path !== undefined && !isEmpty(readSession(transcriptFolders(resolve(path), repo.roots), { branch }));
}

interface Span {
  branch: string;
  from: number;
  now: number;
}

export interface WindowRequest {
  worktreePath: string;
  branch: string;
  now: number;
}

function windowEnd(repo: Repository, { branch, from, now }: Span): number {
  const createdLater = localBranches(repo.root)
    .filter((other) => other !== branch)
    .map((other) => ({ other, start: branchStart(repo.root, other)?.time ?? -Infinity }))
    .filter(({ other, start }) => start > from && !hasOwnTranscripts(repo, other))
    .map(({ start }) => start);
  return Math.min(mergedAt(repo, branch) ?? Infinity, now, ...createdLater);
}

// Una respuesta de otra rama solo es de esta si aquella ya estaba fusionada: así no se suma el trabajo de una rama viva en paralelo.
function countable(repo: Repository): TimeWindow['countable'] {
  const merges = new Map<string, number | null>();
  return (branch, time) => {
    if (!merges.has(branch)) merges.set(branch, mergedAt(repo, branch));
    const merged = merges.get(branch) ?? null;
    return merged !== null && merged < time;
  };
}

const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// shortcut: reconoce la sesión que crea la rama (-b, -B, -c, -C, --branch o git [-C <ruta>] branch); una sesión que
// sigue tras un /clear sin volver a crearla no cuenta. Si un cierre lo sufre, añadir los transcripts que nombran el worktree de la rama.
const creationOf = (branch: string) => new RegExp(`(?:-[bBcC]\\s+|--branch[\\s=]+|git(?:\\s+-C\\s+\\S+)?\\s+branch\\s+)${escaped(branch)}(?![\\w./-])`);

export type WindowResult = { kind: 'noReflog' } | { kind: 'empty' } | ({ kind: 'window' } & Windowed);

export function measureWindow(repo: Repository, { worktreePath, branch, now }: WindowRequest): WindowResult {
  if (gitSync(repo.root, ['rev-parse', '--verify', '--quiet', `refs/heads/${branch}`]) === null) return { kind: 'empty' };
  const start = branchStart(repo.root, branch);
  if (start === null) return { kind: 'noReflog' };
  const window = { from: start.time, to: windowEnd(repo, { branch, from: start.time, now }), countable: countable(repo), createdBy: creationOf(branch) };
  const measured = [...repo.worktrees.values()]
    .map((path) => resolve(path))
    .filter((path) => !samePath(path, worktreePath))
    .map((path) => ({ path, session: readSession(transcriptFolders(path, repo.roots), { branch, window }) }))
    .filter(({ session }) => !isEmpty(session));
  if (measured.length === 0) return { kind: 'empty' };
  const folders = measured.flatMap(({ path }) => transcriptFolders(path, repo.roots));
  return { kind: 'window', session: readSession(folders, { branch, window }), folder: measured.map(({ path }) => path).join(', '), from: window.from, to: window.to };
}
