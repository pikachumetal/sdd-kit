import { describe, it, expect } from 'vitest';
import { spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { hostname } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyFixtureToRepo, counterOf, fixturePath, git, addWorktree, nextId, runNext, tempDir } from './helpers.ts';

const bin = fileURLToPath(new URL('../../bin/sdd.js', import.meta.url));
const host = process.env.COMPUTERNAME ?? hostname();

function holdLock(repo: string, pid: number): string {
  const lockPath = join(repo, '.git/sdd-ids.lock');
  const owner = { branch: 'feature/9999', worktree: 'otra-sesion', pid, host, since: new Date().toISOString() };
  writeFileSync(lockPath, JSON.stringify(owner));
  return lockPath;
}

function deadPid(): number {
  const child = spawnSync(process.execPath, ['-e', '0']);
  return child.pid;
}

function reserveInBackground(root: string): Promise<{ code: number | null; stdout: string }> {
  const child = spawn(process.execPath, [bin, 'id', 'next', '--project-root', root, '--reserve']);
  let stdout = '';
  child.stdout.on('data', (chunk) => (stdout += chunk));
  return new Promise((done) => child.on('close', (code) => done({ code, stdout: stdout.trim() })));
}

describe('id next --reserve', () => {
  it('reserves the next id and leaves it consumed in the common dir counter', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    const result = await runNext(repo, ['--reserve']);
    expect(result.lines).toEqual(['0006']);
    expect(result.code).toBe(0);
    expect(counterOf(repo)).toBe('0006');
  });

  it('does not reuse a reserved id', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    expect(await nextId(repo, ['--reserve'])).toBe('0006');
    expect(await nextId(repo, ['--reserve'])).toBe('0007');
  });

  it('returns consecutive ids, one per line, with --count', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    const result = await runNext(repo, ['--reserve', '--count', '3']);
    expect(result.lines).toEqual(['0006', '0007', '0008']);
    expect(counterOf(repo)).toBe('0008');
  });

  it('prints ids and reserved flag as json', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    const reserved = await runNext(repo, ['--reserve', '--count', '2', '--json']);
    expect(JSON.parse(reserved.lines[0])).toEqual({ ids: ['0006', '0007'], reserved: true });
    const proposed = await runNext(repo, ['--json']);
    expect(JSON.parse(proposed.lines[0])).toEqual({ ids: ['0008'], reserved: false });
  });

  it.each(['0', '100', '1.5', 'x'])('exits 2 for --count %s', async (count) => {
    const result = await runNext(fixturePath('sequence-project'), ['--count', count]);
    expect(result.code).toBe(2);
    expect(result.lines).toEqual([]);
  });

  it('uses its own counter when the project is in a repository subfolder', async () => {
    const parent = join(tempDir(), 'monorepo');
    const project = join(parent, 'apps/proyecto');
    mkdirSync(join(project, '..'), { recursive: true });
    cpSync(fixturePath('sequence-project'), project, { recursive: true });
    git(parent, ['init', '-q', '-b', 'main']);
    writeFileSync(join(parent, '.git/sdd-ids'), '0040\n');
    expect(await nextId(project, ['--reserve'])).toBe('0006');
    expect(readFileSync(join(parent, '.git/sdd-ids-apps-proyecto'), 'utf8').trim()).toBe('0006');
    expect(counterOf(parent)).toBe('0040');
  });

  it('leaves the working tree unchanged', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    await runNext(repo, ['--reserve']);
    expect(git(repo, ['status', '--porcelain'])).toBe('');
  });
});

describe('id next counter', () => {
  it('proposes after the counter without writing it', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    await nextId(repo, ['--reserve']);
    expect(await nextId(repo)).toBe('0007');
    expect(counterOf(repo)).toBe('0006');
  });

  it('does not create the counter when only proposing', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    await nextId(repo);
    expect(existsSync(join(repo, '.git/sdd-ids'))).toBe(false);
  });

  it('lets the scan win when the counter is lower', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    writeFileSync(join(repo, '.git/sdd-ids'), '0002');
    expect(await nextId(repo, ['--reserve'])).toBe('0006');
  });

  it('lets the counter win when it is higher than the scan', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    writeFileSync(join(repo, '.git/sdd-ids'), '0040');
    expect(await nextId(repo, ['--reserve'])).toBe('0041');
  });

  it('warns about an unreadable counter and reinitializes it from the scan', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    writeFileSync(join(repo, '.git/sdd-ids'), 'basura');
    const result = await runNext(repo, ['--reserve']);
    expect(result.lines).toEqual(['0006']);
    expect(result.stderr).toContain('contador');
    expect(counterOf(repo)).toBe('0006');
  });

  it('reserves the legacy-suffix id and only warns about the shared number', async () => {
    const result = await runNext(copyFixtureToRepo('legacy-suffix'), ['--reserve']);
    expect(result.lines).toEqual(['0007']);
    expect(result.code).toBe(0);
    expect(result.stderr).toBe(
      'aviso: carpetas con sufijo anteriores a la secuencia (su número cuenta como ocupado): 20260901-120000-task-0006a-old-split, 20260902-120000-task-0006b-old-split.',
    );
  });
});

describe('id next --reserve with worktrees and processes', () => {
  it('shares the counter between the worktrees of the repository', async () => {
    const repo = copyFixtureToRepo('sequence-project', [], '0059-Reserva-compartida');
    const other = addWorktree(repo, 'feature/otra', 'worktree-reserva');
    expect(await nextId(repo, ['--reserve'])).toBe('0006');
    expect(await nextId(other, ['--reserve'])).toBe('0007');
  });

  it('gives distinct ids to two processes of two worktrees reserving at once', async () => {
    const repo = copyFixtureToRepo('sequence-project', [], '0059-Reserva-simultánea');
    const other = addWorktree(repo, 'feature/otra', 'worktree-simultáneo');
    const lockPath = holdLock(repo, process.pid);
    const jobs = [reserveInBackground(repo), reserveInBackground(other)];
    await new Promise((done) => setTimeout(done, 3000));
    unlinkSync(lockPath);
    const results = await Promise.all(jobs);
    expect(results.map((result) => result.code)).toEqual([0, 0]);
    expect(results.map((result) => result.stdout).sort()).toEqual(['0006', '0007']);
    expect(counterOf(repo)).toBe('0007');
  }, 60_000);

  it('fails without reserving when the lock is not released in time, naming the owner', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    holdLock(repo, process.pid);
    const result = await runNext(repo, ['--reserve', '--lock-timeout', '0.02']);
    expect(result.code).toBe(1);
    expect(result.lines).toEqual([]);
    expect(result.stderr).toContain('Esperando el cerrojo de ids: lo tiene feature/9999 (otra-sesion, PID');
    expect(result.stderr).toContain('cerrojo: no se libera; lo tiene feature/9999');
    expect(existsSync(join(repo, '.git/sdd-ids'))).toBe(false);
  }, 30_000);

  it('removes an orphan lock of a dead process on the same host and reserves', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    holdLock(repo, deadPid());
    const result = await runNext(repo, ['--reserve']);
    expect(result.lines).toEqual(['0006']);
    expect(result.stderr).toContain('Cerrojo huérfano: lo tenía feature/9999 (otra-sesion, PID');
    expect(existsSync(join(repo, '.git/sdd-ids.lock'))).toBe(false);
  });

  it('writes the lock owner in the format of the PowerShell lock while it holds it', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    const lockPath = join(repo, '.git/sdd-ids.lock');
    const { withLock } = await import('../../src/git/lock.ts');
    const { memoryIo } = await import('../../src/cli/io.ts');
    const owner = await withLock({ path: lockPath, label: 'ids', io: memoryIo(), owner: { branch: 'b', worktree: 'w' } }, 1, async () => JSON.parse(readFileSync(lockPath, 'utf8')));
    expect(Object.keys(owner)).toEqual(['branch', 'worktree', 'pid', 'host', 'since']);
    expect(owner.pid).toBe(process.pid);
    expect([owner.branch, owner.worktree]).toEqual(['b', 'w']);
    expect(existsSync(lockPath)).toBe(false);
  });
});

describe('id next --reserve refusals', () => {
  it('fails without a git repository', async () => {
    const plain = join(tempDir(), 'project');
    cpSync(fixturePath('sequence-project'), plain, { recursive: true });
    const saved = process.env.GIT_CEILING_DIRECTORIES;
    process.env.GIT_CEILING_DIRECTORIES = join(plain, '..');
    try {
      const result = await runNext(plain, ['--reserve']);
      expect(result.lines).toEqual([]);
      expect(result.stderr).toContain('git');
      expect(result.code).toBe(1);
    } finally {
      if (saved === undefined) delete process.env.GIT_CEILING_DIRECTORIES;
      else process.env.GIT_CEILING_DIRECTORIES = saved;
    }
  });

  it('consumes no id when there are duplicate ids', async () => {
    const repo = copyFixtureToRepo('duplicate-ids');
    const result = await runNext(repo, ['--reserve']);
    expect(result.code).toBe(1);
    expect(existsSync(join(repo, '.git/sdd-ids'))).toBe(false);
  });

  it('does not create the counter in tracker mode', async () => {
    const repo = copyFixtureToRepo('tracker-project');
    const result = await runNext(repo, ['--reserve']);
    expect(result.code).toBe(1);
    expect(existsSync(join(repo, '.git/sdd-ids'))).toBe(false);
  });

  it('fails without reserving when the reservation would pass 9999', async () => {
    const repo = copyFixtureToRepo('sequence-project');
    writeFileSync(join(repo, '.git/sdd-ids'), '9998');
    const result = await runNext(repo, ['--reserve', '--count', '2']);
    expect(result.lines).toEqual([]);
    expect(result.code).toBe(1);
    expect(counterOf(repo)).toBe('9998');
  });
});
