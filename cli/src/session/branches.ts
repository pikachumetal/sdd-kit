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
export function lastMergeTime(root: string, branch: string, into: string): number | null {
  const start = branchStart(root, branch);
  const own = new Set(gitSync(root, ['rev-list', '--first-parent', start === null ? branch : `${start.sha}..${branch}`]) ?? []);
  for (const merge of gitSync(root, ['log', '--first-parent', '--merges', '--format=%ct %P', into]) ?? []) {
    const [time, , second] = merge.split(' ');
    if (own.has(second)) return Number(time) * 1000;
  }
  return null;
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
