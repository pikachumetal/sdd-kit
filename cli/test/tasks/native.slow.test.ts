import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('../../bin/sdd.js', import.meta.url));
const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
const plan = 'docs/plan.md';

function git(cwd: string, ...args: string[]): string {
  const result = spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args], { cwd, env: cleanEnv, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')}: ${result.stderr}`);
  return result.stdout.trim();
}

function newRepo(): string {
  const repo = mkdtempSync(join(tmpdir(), 'sdd-native-'));
  git(repo, 'init', '-q', '-b', 'main');
  mkdirSync(join(repo, 'docs'));
  writeFileSync(join(repo, plan), '# Plan\n\n### Task 1: Primera\n\nHacer la primera.\n\n### Task 2: Segunda\n\nHacer la segunda.\n');
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', 'base');
  return repo;
}

// La base de una task con un commit encima, como tras hacerla.
function baseWithCommit(repo: string): string {
  const base = git(repo, 'rev-parse', 'HEAD');
  writeFileSync(join(repo, 'work.txt'), 'x\n');
  git(repo, 'add', '-A');
  git(repo, 'commit', '-q', '-m', 'task');
  return base;
}

function sdd(repo: string, ...args: string[]) {
  const result = spawnSync(process.execPath, [bin, ...args], { cwd: repo, env: cleanEnv, encoding: 'utf8' });
  return { code: result.status, out: result.stdout, err: result.stderr };
}

function ledger(repo: string): string {
  const workspace = sdd(repo, 'workspace', plan).out.trim();
  return readFileSync(join(workspace, 'progress.md'), 'utf8');
}

describe('sdd task start / task done', () => {
  it.runIf(process.platform === 'win32')('start prints a windows path', () => {
    const repo = newRepo();
    const result = sdd(repo, 'task', 'start', plan, '1');
    expect(result.code).toBe(0);
    expect(result.out).toMatch(/^brief: [A-Za-z]:\\/m);
    expect(result.out).toMatch(/^base: [0-9a-f]{40}$/m);
  });

  it('done records a silent command', () => {
    const repo = newRepo();
    const base = baseWithCommit(repo);
    const result = sdd(repo, 'task', 'done', plan, '1', base, '--', process.execPath, '-e', '');
    expect(result.code).toBe(0);
    expect(ledger(repo)).toMatch(/^Task 1: complete \(commits [0-9a-f]{7}\.\.[0-9a-f]{7}, tests: .* → \(sin salida\)\)$/m);
  });

  it('done does not record a failing command', () => {
    const repo = newRepo();
    const base = baseWithCommit(repo);
    const result = sdd(repo, 'task', 'done', plan, '1', base, '--', process.execPath, '-e', 'process.exit(3)');
    expect(result.code).toBe(3);
    expect(sdd(repo, 'workspace', plan).code).toBe(0);
    let text = '';
    try {
      text = ledger(repo);
    } catch {
      text = '';
    }
    expect(text).not.toContain('Task 1: complete');
  });

  it('done refuses a task whose range is empty', () => {
    const repo = newRepo();
    const head = git(repo, 'rev-parse', 'HEAD');
    const result = sdd(repo, 'task', 'done', plan, '1', head, '--', process.execPath, '-e', 'console.log("ran")');
    expect(result.code).toBe(1);
    expect(result.err).toContain('sin commits en el rango: ¿falló el pre-commit?');
    expect(result.out).not.toContain('ran');
    expect(existsSync(join(sdd(repo, 'workspace', plan).out.trim(), 'progress.md'))).toBe(false);
  });

  it('done exits 127 for a missing command', () => {
    const repo = newRepo();
    const base = baseWithCommit(repo);
    const result = sdd(repo, 'task', 'done', plan, '1', base, '--', 'no-existe-este-comando-sdd');
    expect(result.code).toBe(127);
  });

  it('done keeps quoted arguments intact', () => {
    const repo = newRepo();
    const base = baseWithCommit(repo);
    const result = sdd(repo, 'task', 'done', plan, '1', base, '--', process.execPath, '-e', 'console.log(process.argv[1])', 'a b');
    expect(result.code).toBe(0);
    expect(result.out).toContain('a b');
    expect(ledger(repo)).toContain("'a b'");
  });

  it('rulings without ledger prints Sin rulings', () => {
    const repo = newRepo();
    const result = sdd(repo, 'ledger', 'rulings', plan);
    expect(result.code).toBe(0);
    expect(result.out.trim()).toBe('Sin rulings');
  });

  it('rulings does not create the workspace', () => {
    const repo = newRepo();
    sdd(repo, 'ledger', 'rulings', plan);
    expect(existsSync(join(repo, '.superpowers'))).toBe(false);
  });

  it('rulings reads the ledger of an existing workspace', () => {
    const repo = newRepo();
    const workspace = sdd(repo, 'workspace', plan).out.trim();
    writeFileSync(join(workspace, 'progress.md'), 'Task 1: Ruling: se queda como está\n');
    expect(sdd(repo, 'ledger', 'rulings', plan).out.trim()).toBe('Task 1: Ruling: se queda como está');
  });

  it('start fails without a plan', () => {
    const repo = newRepo();
    const result = sdd(repo, 'task', 'start', 'docs/no-existe.md', '1');
    expect(result.code).not.toBe(0);
    expect(result.out).not.toMatch(/^brief: /m);
  });
});
