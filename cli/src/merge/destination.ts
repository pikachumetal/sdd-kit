import { basename } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { git, gitLines, worktrees } from '../git/git.ts';
import { withWorktreeFolder } from './temp-worktree.ts';

export interface DestinationRequest {
  projectRoot: string;
  into: string;
  branch: string;
  warn: (message: string) => void;
}

async function assertClean(path: string, into: string): Promise<void> {
  const status = await gitLines(path, ['status', '--porcelain']);
  if (status.length > 0) throw new DomainError(`destino sacado: '${into}' tiene cambios sin guardar en '${path}':\n${status.join('\n')}`);
}

export async function withDestination<T>(request: DestinationRequest, body: (path: string) => Promise<T>): Promise<T> {
  const { projectRoot, into, branch, warn } = request;
  await git(projectRoot, ['worktree', 'prune']);
  const found = (await worktrees(projectRoot)).find((entry) => entry.branch === into);
  if (found === undefined) return withWorktreeFolder(projectRoot, { branch: into, folder: `merge-${basename(branch)}`, warn }, body);
  await assertClean(found.path, into);
  return body(found.path);
}
