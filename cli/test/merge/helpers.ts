import { afterAll, vi } from 'vitest';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { hostname, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { generateEstimationLog, writeEstimationLog } from '../../src/estimation/log.ts';
import { run } from '../../src/main.ts';

const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
const roots: string[] = [];

vi.setConfig({ testTimeout: 120_000 });

afterAll(() => {
  roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true }));
});

export function git(dir: string, ...args: string[]): string {
  const result = spawnSync('git', args, { cwd: dir, env: cleanEnv, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} en ${dir}: ${result.stderr}`);
  return result.stdout.trim();
}

export const sha = (dir: string, rev: string): string => git(dir, 'rev-parse', rev);

export function write(dir: string, relative: string, content: string): void {
  const path = join(dir, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

export function edit(dir: string, relative: string, from: string, to: string): void {
  const path = join(dir, relative);
  writeFileSync(path, readFileSync(path, 'utf8').replace(from, to));
}

export function saveAll(dir: string, message: string): void {
  git(dir, 'add', '-A');
  git(dir, 'commit', '-q', '-m', message);
}

export function writePatchSpec(dir: string, id: string): void {
  const content = `---\ntask: ${id}\n---\n## 5. Tiempo (ligero)\n\n- Estimación: 1h\n- Real: 1 h\n`;
  write(dir, `.docs/sdd/specs/20260901-100000-patch-${id}-fixture/patch.md`, content);
  const { text, docsPath } = generateEstimationLog(dir, () => undefined);
  writeEstimationLog(text, join(docsPath, 'estimation-log.md'), () => undefined);
}

function configure(dir: string, hooks: string): void {
  const settings = { 'user.name': 'Fixture', 'user.email': 'fixture@example.com', 'core.hooksPath': hooks, 'core.autocrlf': 'false', 'commit.gpgsign': 'false' };
  Object.entries(settings).forEach(([key, value]) => git(dir, 'config', key, value));
}

function seedRepo(seed: string, hooks: string): void {
  mkdirSync(seed, { recursive: true });
  git(seed, 'init', '-q', '-b', 'develop');
  configure(seed, hooks);
  write(seed, '.docs/sdd/sdd-kit.json', '{"merge": {"into": "develop", "noFf": true, "removeWorktree": false}}');
  write(seed, 'README.md', 'base\n');
  write(seed, '.docs/sdd/roadmap.md', '# Roadmap\n\n## Patches\n\n| Id | Fix |\n| --- | --- |\n| 0100 | base |\n\n## Deuda\n');
  write(seed, '.docs/sdd/changelog.md', '# Changelog\n\n## [Unreleased]\n\n### Fixed\n\n- base\n\n## [0.1.0]\n');
  writePatchSpec(seed, '0100');
  saveAll(seed, 'chore: base');
  for (const id of ['0001', '0002']) {
    git(seed, 'checkout', '-q', '-b', `feature/${id}`, 'develop');
    write(seed, `feature-${id}.txt`, `${id}\n`);
    saveAll(seed, `feat: ${id}`);
  }
  git(seed, 'checkout', '-q', 'develop');
}

export interface Fixture {
  root: string;
  seed: string;
  remote: string;
  repo: string;
  wt: string;
  lock: string;
}

export function mergeFixture(name: string): Fixture {
  const root = join(mkdtempSync(join(tmpdir(), 'sdd-merge-')), `Fusión ñ ${name}`);
  roots.push(dirname(root));
  const hooks = join(root, 'no-hooks');
  mkdirSync(hooks, { recursive: true });
  const seed = join(root, 'seed');
  seedRepo(seed, hooks);
  const remote = join(root, 'remote.git');
  git(root, 'clone', '-q', '--bare', seed, remote);
  git(remote, 'config', 'core.hooksPath', hooks);
  const repo = join(root, 'git/repo.git');
  git(root, 'clone', '-q', '--bare', remote, repo);
  configure(repo, hooks);
  git(repo, 'config', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*');
  git(repo, 'fetch', '-q', 'origin');
  const wt = join(root, 'wt');
  ['0001', '0002'].forEach((id) => git(repo, 'worktree', 'add', '-q', join(wt, id), `feature/${id}`));
  return { root, seed, remote, repo, wt, lock: join(repo, 'sdd-merge.lock') };
}

export function pushRemoteCommit(fx: Fixture, relative: string, content: string): string {
  write(fx.seed, relative, content);
  saveAll(fx.seed, `chore: ${relative} en el remoto`);
  git(fx.seed, 'push', '-q', fx.remote, 'develop');
  return sha(fx.seed, 'HEAD');
}

export async function runMerge(worktree: string, extra: string[] = []): Promise<{ code: number; text: string }> {
  const io = memoryIo();
  const code = await run(['merge', '--project-root', worktree, ...extra], io);
  return { code, text: [...io.stdout, ...io.stderr].join('\n') };
}

export function lockFile(path: string, pid: number, branch: string): void {
  const owner = { branch, worktree: 'otra-sesion', pid, host: process.env.COMPUTERNAME ?? hostname(), since: new Date().toISOString() };
  writeFileSync(path, JSON.stringify(owner));
}

export function deadPid(): number {
  const child = spawnSync(process.execPath, ['-e', '']);
  return child.pid;
}

export function cleanedUp(fx: Fixture): boolean {
  return !existsSync(join(fx.wt, 'merge-0001')) && !git(fx.repo, 'worktree', 'list').includes('merge-0001') && !existsSync(fx.lock);
}

export const isWindows = process.platform === 'win32';
export const sleepCommand = (seconds: number) => (isWindows ? `Start-Sleep -Seconds ${seconds}` : `sleep ${seconds}`);
