import { afterAll } from 'vitest';
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';

export const fixtures = fileURLToPath(new URL('../fixtures/task-ids', import.meta.url));
export const kitRoot = fileURLToPath(new URL('../../../', import.meta.url));

const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
const roots: string[] = [];

afterAll(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

export function tempDir(): string {
  const root = mkdtempSync(join(tmpdir(), 'sdd-ids-'));
  roots.push(root);
  return root;
}

export function git(cwd: string, args: string[]): string {
  const result = spawnSync('git', args, { cwd, env: cleanEnv, encoding: 'utf8' });
  return result.stdout.trim();
}

export function commit(repo: string, message: string): void {
  git(repo, ['add', '-A']);
  git(repo, ['-c', 'user.email=fixture@local', '-c', 'user.name=Fixture', 'commit', '-qm', message]);
}

export function copyFixtureToRepo(name: string, branches: string[] = [], folderName = 'project'): string {
  const parent = tempDir();
  const repo = join(parent, folderName);
  // Node 22.18 cpSync no copia nada si el destino tiene caracteres no ASCII: se copia a una ruta ASCII y se renombra.
  cpSync(join(fixtures, name), join(parent, 'staging'), { recursive: true });
  renameSync(join(parent, 'staging'), repo);
  git(repo, ['init', '-q', '-b', 'main']);
  commit(repo, 'fixture');
  branches.forEach((branch) => git(repo, ['branch', branch]));
  return repo;
}

export function addUnmergedCommit(repo: string, branch: string, relativePath: string, line: string): void {
  const current = git(repo, ['branch', '--show-current']);
  git(repo, ['switch', '-qc', branch]);
  const target = join(repo, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  appendFileSync(target, `${line}\n`);
  commit(repo, `trabajo en ${branch}`);
  git(repo, ['switch', '-q', current]);
}

export function addWorktree(repo: string, branch: string, folder: string): string {
  const worktree = join(dirname(repo), folder);
  git(repo, ['worktree', 'add', '-qb', branch, worktree]);
  return worktree;
}

export function counterOf(repo: string): string | null {
  const path = join(repo, '.git/sdd-ids');
  return existsSync(path) ? readFileSync(path, 'utf8').trim() : null;
}

export type Outcome = { lines: string[]; stderr: string; code: number };

export async function runNext(root: string, extra: string[] = []): Promise<Outcome> {
  const io = memoryIo();
  const code = await run(['id', 'next', '--project-root', root, ...extra], io);
  return { lines: io.stdout, stderr: io.stderr.join('\n'), code };
}

export async function nextId(root: string, extra: string[] = []): Promise<string> {
  return (await runNext(root, extra)).lines[0];
}

export function fixturePath(name: string): string {
  return join(fixtures, name);
}
