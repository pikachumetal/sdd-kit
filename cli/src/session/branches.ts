import { gitSync } from '../git/git.ts';

export interface BranchStart {
  sha: string;
  time: number;
}

const REFLOG_ENTRY = /^([0-9a-f]+) .*@\{(\d+)\}$/;

export function branchStart(root: string, branch: string): BranchStart | null {
  const entries = gitSync(root, ['reflog', 'show', '--date=unix', '--format=%H %gd', `refs/heads/${branch}`]);
  const match = REFLOG_ENTRY.exec(entries?.at(-1) ?? '');
  return match === null ? null : { sha: match[1], time: Number(match[2]) * 1000 };
}

// Un merge es de la rama si su segundo padre está en la línea de primer padre de la rama desde que nació:
// así no cuentan las features que la rama trajo de develop con sus merges de sincronización.
function lastMerge(root: string, branch: string, into: string): { time: number; first: string; second: string } | null {
  const start = branchStart(root, branch);
  const own = new Set(gitSync(root, ['rev-list', '--first-parent', start === null ? branch : `${start.sha}..${branch}`]) ?? []);
  for (const merge of gitSync(root, ['log', '--first-parent', '--merges', '--format=%ct %P', into]) ?? []) {
    const [time, first, second] = merge.split(' ');
    if (own.has(second)) return { time: Number(time) * 1000, first: first!, second: second! };
  }
  return null;
}

export function lastMergeTime(root: string, branch: string, into: string): number | null {
  return lastMerge(root, branch, into)?.time ?? null;
}

export interface BranchCommit {
  time: number;
  closing: boolean;
}

// El commit de cierre solo se reconoce con la rama fusionada: antes, el último commit es solo el último por ahora.
export function commitsOf(root: string, branch: string, into: string): BranchCommit[] {
  const merge = lastMerge(root, branch, into);
  const range = merge === null ? `${into}..${branch}` : `${merge.first}..${merge.second}`;
  const times = gitSync(root, ['log', '--first-parent', '--no-merges', '--reverse', '--format=%ct', range]) ?? [];
  return times.map((time, index) => ({ time: Number(time) * 1000, closing: merge !== null && index === times.length - 1 }));
}

export function localBranches(root: string): string[] {
  return gitSync(root, ['for-each-ref', '--format=%(refname:short)', 'refs/heads']) ?? [];
}

export function worktreeOf(root: string): Map<string, string> {
  const paths = new Map<string, string>();
  let path = '';
  for (const line of gitSync(root, ['worktree', 'list', '--porcelain']) ?? []) {
    if (line.startsWith('worktree ')) path = line.slice('worktree '.length);
    if (line.startsWith('branch refs/heads/')) paths.set(line.slice('branch refs/heads/'.length), path);
  }
  return paths;
}
