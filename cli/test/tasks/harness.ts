import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('../../bin/sdd.js', import.meta.url));
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));

export function git(cwd: string, ...args: string[]): string {
  const identity = ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false'];
  const result = spawnSync('git', [...identity, ...args], { cwd, env: cleanEnv, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
  return result.stdout.trim();
}

export function sddWithEnv(cwd: string, env: NodeJS.ProcessEnv, args: string[]) {
  const result = spawnSync(process.execPath, [bin, ...args], { cwd, env: { ...cleanEnv, ...env }, encoding: 'utf8' });
  return { code: result.status, out: result.stdout, err: result.stderr };
}

export function sdd(cwd: string, ...args: string[]) {
  return sddWithEnv(cwd, {}, args);
}

export function scratchDir(): string {
  return realpathSync.native(mkdtempSync(join(tmpdir(), 'sdd-task-')));
}

export function emptyRepo(): string {
  const repo = join(scratchDir(), 'repo');
  mkdirSync(repo);
  git(repo, 'init', '-q', '-b', 'main');
  return resolve(git(repo, 'rev-parse', '--show-toplevel'));
}

export function write(path: string, text: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

export function planText(title: string, task: string, body: string): string {
  return `# ${title}\n\n## Task 1: ${task}\n\n${body}\n`;
}

export function commitAll(repo: string, message: string): string {
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', message);
  return git(repo, 'rev-parse', 'HEAD');
}
