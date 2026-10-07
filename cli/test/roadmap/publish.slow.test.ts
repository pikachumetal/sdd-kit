import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { hostname, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { run } from '../../src/main.ts';
import { memoryIo } from '../../src/cli/io.ts';

const roadmap = '.docs/sdd/roadmap.md';
const proposal = '.docs/sdd/specs/20261007-000000-proposal-0149-salas/proposal.md';
const message = 'docs(roadmap): reservar 0150 y 0151';
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd, env: cleanEnv, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
  return result.stdout.trim();
}

function write(root: string, path: string, content: string): void {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
}

interface Repo {
  main: string;
  session: string;
}

function newRepo(withMergeInto = true): Repo {
  const base = mkdtempSync(join(tmpdir(), 'sdd-publish-'));
  const main = join(base, 'salas');
  mkdirSync(main);
  git(main, 'init', '-q', '-b', 'develop');
  write(main, '.docs/sdd/sdd-kit.json', withMergeInto ? '{"merge":{"into":"develop"}}\n' : '{}\n');
  write(main, roadmap, '# Roadmap\n\n| id | Feature |\n| --- | --- |\n| 0149 | Salas |\n');
  git(main, 'add', '-A');
  git(main, 'commit', '-q', '-m', 'base');
  const session = join(base, 'f0150');
  git(main, 'worktree', 'add', '-q', '-b', 'feature/0150', session);
  write(session, roadmap, '# Roadmap\n\n| id | Feature |\n| --- | --- |\n| 0149 | Salas |\n| 0150 | Filtro |\n| 0151 | Exportar |\n');
  return { main, session };
}

async function publish(cwd: string, ...extra: string[]) {
  const io = memoryIo();
  const code = await run(['roadmap', 'publish', '--project-root', cwd, ...extra], io);
  return { code, out: io.stdout.join('\n'), err: io.stderr.join('\n') };
}

function lastCommit(repo: string) {
  return {
    subject: git(repo, 'log', '-1', '--format=%s', 'develop'),
    files: git(repo, 'show', '--name-only', '--format=', 'develop').split('\n').filter(Boolean),
    roadmap: git(repo, 'show', `develop:${roadmap}`),
  };
}

function holdLock(repo: string): string {
  const lock = join(git(repo, 'rev-parse', '--path-format=absolute', '--git-common-dir'), 'sdd-merge.lock');
  const owner = { branch: 'feature/0149', worktree: repo, pid: process.pid, host: hostname(), since: new Date().toISOString() };
  writeFileSync(lock, JSON.stringify(owner));
  return lock;
}

describe('sdd roadmap publish', () => {
  it('publishes into the worktree where develop is checked out', async () => {
    const repo = newRepo();
    const result = await publish(repo.session, '--message', message, roadmap);
    expect(result.code).toBe(0);
    const commit = lastCommit(repo.main);
    expect(commit.subject).toBe(message);
    expect(commit.files).toEqual([roadmap]);
    expect(commit.roadmap).toContain('| 0151 | Exportar |');
    expect(readFileSync(join(repo.main, roadmap), 'utf8')).toContain('| 0151 | Exportar |');
  });

  it('publishes proposal in the same commit', async () => {
    const repo = newRepo();
    write(repo.session, proposal, '# Propuesta 0149\n');
    const result = await publish(repo.session, '--message', message, roadmap, proposal);
    expect(result.code).toBe(0);
    expect(lastCommit(repo.main).files.sort()).toEqual([proposal, roadmap].sort());
  });

  it('uses a temp worktree when develop is not checked out', async () => {
    const repo = newRepo();
    git(repo.main, 'checkout', '-q', '-b', 'otra');
    const before = git(repo.main, 'worktree', 'list').split('\n').length;
    const result = await publish(repo.session, '--message', message, roadmap);
    expect(result.code).toBe(0);
    expect(lastCommit(repo.main).subject).toBe(message);
    expect(git(repo.main, 'worktree', 'list').split('\n').length).toBe(before);
  });

  it('waits for the merge lock then publishes', async () => {
    const repo = newRepo();
    const lock = holdLock(repo.main);
    setTimeout(() => unlinkSync(lock), 2000);
    const result = await publish(repo.session, '--message', message, roadmap);
    expect(result.code).toBe(0);
    expect(result.out + result.err).toContain('Esperando el cerrojo de merge: lo tiene feature/0149');
    expect(lastCommit(repo.main).subject).toBe(message);
  });

  it('gives up when the lock is not released', async () => {
    const repo = newRepo();
    const lock = holdLock(repo.main);
    const result = await publish(repo.session, '--message', message, '--lock-timeout', '0.05', roadmap);
    unlinkSync(lock);
    expect(result.code).toBe(1);
    expect(result.err).toContain('cerrojo: no se libera; lo tiene feature/0149');
    expect(lastCommit(repo.main).subject).toBe('base');
  });

  it('refuses when develop changed the file since the base', async () => {
    const repo = newRepo();
    write(repo.main, roadmap, '# Roadmap\n\n| id | Feature |\n| --- | --- |\n| 0149 | Salas |\n| 0152 | Otra sesión |\n');
    git(repo.main, 'commit', '-q', '-am', 'otra reserva');
    const result = await publish(repo.session, '--message', message, roadmap);
    expect(result.code).toBe(1);
    expect(result.err).toContain('develop cambió .docs/sdd/roadmap.md desde tu base: integra develop antes de publicar');
    expect(lastCommit(repo.main).subject).toBe('otra reserva');
  });

  it('refuses a dirty target', async () => {
    const repo = newRepo();
    write(repo.main, roadmap, '# Roadmap a medio editar\n');
    const result = await publish(repo.session, '--message', message, roadmap);
    expect(result.code).toBe(1);
    expect(result.err).toContain(`destino con cambios: .docs/sdd/roadmap.md en ${repo.main}`);
    expect(lastCommit(repo.main).subject).toBe('base');
  });

  it('exits 2 without integration branch', async () => {
    const repo = newRepo(false);
    const result = await publish(repo.session, '--message', message, roadmap);
    expect(result.code).toBe(2);
    expect(lastCommit(repo.main).subject).toBe('base');
  });

  it('accepts --into without merge.into', async () => {
    const repo = newRepo(false);
    const result = await publish(repo.session, '--message', message, '--into', 'develop', roadmap);
    expect(result.code).toBe(0);
    expect(lastCommit(repo.main).subject).toBe(message);
  });

  it('exits 2 for a path outside .docs/sdd', async () => {
    const repo = newRepo();
    write(repo.session, 'README.md', 'hola\n');
    const result = await publish(repo.session, '--message', message, 'README.md');
    expect(result.code).toBe(2);
    expect(existsSync(join(repo.main, 'README.md'))).toBe(false);
  });
});
