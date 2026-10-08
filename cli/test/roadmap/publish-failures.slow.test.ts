import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { run } from '../../src/main.ts';
import { memoryIo } from '../../src/cli/io.ts';

const roadmap = '.docs/sdd/roadmap.md';
const message = 'docs(roadmap): reservar 0150 y 0151';
const baseRoadmap = '# Roadmap\n\n| id | Feature |\n| --- | --- |\n| 0149 | Salas |\n';
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

function newRepo() {
  const base = mkdtempSync(join(tmpdir(), 'sdd-publish-fail-'));
  const main = join(base, 'salas');
  mkdirSync(main);
  git(main, 'init', '-q', '-b', 'develop');
  write(main, '.docs/sdd/sdd-kit.json', '{"merge":{"into":"develop"}}\n');
  write(main, roadmap, baseRoadmap);
  git(main, 'add', '-A');
  git(main, 'commit', '-q', '-m', 'base');
  const session = join(base, 'f0150');
  git(main, 'worktree', 'add', '-q', '-b', 'feature/0150', session);
  write(session, roadmap, `${baseRoadmap}| 0150 | Filtro |\n`);
  return { main, session };
}

function roadmapOf(root: string): string {
  return readFileSync(join(root, roadmap), 'utf8').replaceAll('\r\n', '\n');
}

async function publish(cwd: string, ...extra: string[]) {
  const io = memoryIo();
  const code = await run(['roadmap', 'publish', '--project-root', cwd, '--message', message, ...extra], io);
  return { code, err: io.stderr.join('\n') };
}

describe('sdd roadmap publish failures', () => {
  it('rolls back the target when the commit fails', async () => {
    const repo = newRepo();
    write(repo.main, '.git/hooks/pre-commit', '#!/bin/sh\nexit 1\n');
    const result = await publish(repo.session, roadmap);
    expect(result.code).toBe(1);
    expect(git(repo.main, 'status', '--porcelain')).toBe('');
    expect(roadmapOf(repo.main)).toBe(baseRoadmap);
    expect(git(repo.main, 'log', '-1', '--format=%s', 'develop')).toBe('base');
  });

  it('rolls back a new file when the commit fails', async () => {
    const repo = newRepo();
    const added = '.docs/sdd/nuevo.md';
    write(repo.session, added, 'nuevo\n');
    write(repo.main, '.git/hooks/pre-commit', '#!/bin/sh\nexit 1\n');
    const result = await publish(repo.session, roadmap, added);
    expect(result.code).toBe(1);
    expect(git(repo.main, 'status', '--porcelain')).toBe('');
  });

  it('refuses when the target status fails', async () => {
    const repo = newRepo();
    writeFileSync(join(repo.main, '.git', 'index'), 'basura');
    const result = await publish(repo.session, roadmap);
    expect(result.code).toBe(1);
    expect(roadmapOf(repo.main)).toBe(baseRoadmap);
  });

  it('reports a git error instead of a change when the diff fails', async () => {
    const repo = newRepo();
    write(repo.main, roadmap, `${baseRoadmap}| 0152 | Otra |\n`);
    git(repo.main, 'commit', '-q', '-am', 'otra reserva');
    const tree = git(repo.main, 'rev-parse', 'develop^{tree}');
    rmSync(join(repo.main, '.git', 'objects', tree.slice(0, 2), tree.slice(2)), { force: true });
    const result = await publish(repo.session, roadmap);
    expect(result.code).toBe(1);
    expect(result.err).not.toContain('desde tu base');
  });

  it('refuses without a common base', async () => {
    const repo = newRepo();
    git(repo.session, 'checkout', '-q', '--orphan', 'lone');
    git(repo.session, 'commit', '-q', '-m', 'sola');
    const result = await publish(repo.session, roadmap);
    expect(result.code).toBe(1);
    expect(git(repo.main, 'log', '-1', '--format=%s', 'develop')).toBe('base');
    expect(roadmapOf(repo.main)).toBe(baseRoadmap);
  });

  it('reports a missing project root', async () => {
    const result = await publish(join(tmpdir(), 'sdd-no-existe-xyz'), roadmap);
    expect(result.code).toBe(1);
    expect(result.err).toContain('No existe la ruta de proyecto');
  });
});
