import { existsSync, readdirSync, rmdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { DomainError } from '../cli/args.ts';
import { git, samePath, toplevel, worktrees } from '../git/git.ts';

export interface TempWorktreeSpec {
  branch: string;
  folder: string;
  warn?: (message: string) => void;
}

export async function worktreesParent(repo: string): Promise<string> {
  return dirname((await toplevel(repo)) ?? resolve(repo));
}

async function isEmptyOrphanFolder(repo: string, path: string): Promise<boolean> {
  if (!existsSync(path) || readdirSync(path).length > 0) return false;
  return !(await worktrees(repo)).some((entry) => samePath(entry.path, path));
}

function removeQuietly(path: string): void {
  try {
    rmdirSync(path);
  } catch {
    return;
  }
}

const warnToStderr = (message: string) => void process.stderr.write(`${message}\n`);

const REMOVE_ATTEMPTS = 3;
const REMOVE_RETRY_MILLISECONDS = 100;

const sleep = (milliseconds: number) => new Promise<void>((done) => setTimeout(done, milliseconds));

async function tryRemove(repo: string, path: string): Promise<boolean> {
  for (let attempt = 1; attempt <= REMOVE_ATTEMPTS; attempt++) {
    if ((await git(repo, ['worktree', 'remove', path])).code === 0) return true;
    if ((await git(repo, ['worktree', 'remove', '--force', path])).code === 0) return true;
    if (attempt < REMOVE_ATTEMPTS) await sleep(REMOVE_RETRY_MILLISECONDS);
  }
  return false;
}

async function removeWorktree(repo: string, path: string, warn: (message: string) => void): Promise<void> {
  await tryRemove(repo, path);
  if (await isEmptyOrphanFolder(repo, path)) removeQuietly(path);
  await git(repo, ['worktree', 'prune']);
  const registered = (await worktrees(repo)).some((entry) => samePath(entry.path, path));
  if (existsSync(path) || registered) warn(`No se pudo retirar el worktree temporal '${path}'.`);
}

async function addWorktree(repo: string, spec: TempWorktreeSpec): Promise<string> {
  const path = join(await worktreesParent(repo), spec.folder);
  if (existsSync(path)) {
    if (!(await isEmptyOrphanFolder(repo, path))) throw new DomainError(`destino sacado: ya existe '${path}'.`);
    rmdirSync(path);
  }
  if ((await git(repo, ['worktree', 'add', path, spec.branch])).code !== 0) {
    throw new DomainError(`destino sacado: no se pudo crear el worktree de '${spec.branch}' en '${path}'.`);
  }
  return path;
}

export async function withWorktreeFolder<T>(repo: string, spec: TempWorktreeSpec, body: (path: string) => Promise<T>): Promise<T> {
  const path = await addWorktree(repo, spec);
  try {
    return await body(path);
  } finally {
    await removeWorktree(repo, path, spec.warn ?? warnToStderr);
  }
}

export function withTempWorktree<T>(repo: string, branch: string, body: (path: string) => Promise<T>): Promise<T> {
  return withWorktreeFolder(repo, { branch, folder: `merge-${basename(branch)}` }, body);
}
