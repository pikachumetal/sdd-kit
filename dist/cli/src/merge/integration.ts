import { resolve } from 'node:path';
import { DomainError } from '../cli/args.ts';
import type { Io } from '../cli/io.ts';
import { commonDir, git, worktrees } from '../git/git.ts';
import { withLock } from '../git/lock.ts';
import { withTempWorktree } from './temp-worktree.ts';

export async function runGit(cwd: string, args: string[]): Promise<string> {
  const { code, stdout, stderr } = await git(cwd, args);
  if (code !== 0) throw new DomainError(`git ${args[0]} falló en '${cwd}': ${(stderr || stdout).trim()}`);
  return stdout.trim();
}

export async function withIntegrationTarget<T>(root: string, into: string, body: (target: string) => Promise<T>): Promise<T> {
  await git(root, ['worktree', 'prune']);
  const found = (await worktrees(root)).find((entry) => entry.branch === into);
  return found === undefined ? withTempWorktree(root, into, body) : body(found.path);
}

export async function withMergeLock<T>(root: string, owner: { branch: string; io: Io; minutes: number }, body: () => Promise<T>): Promise<T> {
  const path = resolve(await commonDir(root), 'sdd-merge.lock');
  const lock = { path, label: 'merge', io: { ...owner.io, err: owner.io.out }, owner: { branch: owner.branch, worktree: root } };
  return withLock(lock, owner.minutes, body);
}
