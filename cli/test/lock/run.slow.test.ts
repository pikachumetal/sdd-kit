import { describe, it, expect } from 'vitest';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { hostname } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addWorktree, commit, git, tempDir } from '../ids/helpers.ts';

const bin = fileURLToPath(new URL('../../bin/sdd.js', import.meta.url));
const slashedBin = bin.replace(/\\/g, '/');

type Result = { code: number | null; stdout: string; stderr: string };

function lockRun(cwd: string, script: string, env: NodeJS.ProcessEnv = process.env): Promise<Result> {
  const child = spawn(process.execPath, [bin, 'lock', 'run', '--', process.execPath, '-e', script], { cwd, env });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => (stdout += chunk));
  child.stderr.on('data', (chunk) => (stderr += chunk));
  return new Promise((done) => child.on('close', (code) => done({ code, stdout: stdout.trim(), stderr })));
}

async function until(condition: () => boolean): Promise<void> {
  while (!condition()) await new Promise((done) => setTimeout(done, 50));
}

function repoWithWorktree(): { repo: string; other: string } {
  const repo = join(tempDir(), 'project');
  mkdirSync(repo);
  writeFileSync(join(repo, 'README.md'), 'fixture\n');
  git(repo, ['init', '-q', '-b', 'main']);
  commit(repo, 'fixture');
  return { repo, other: addWorktree(repo, 'feature/otra', 'otro-worktree') };
}

const slashed = (path: string): string => path.replace(/\\/g, '/');
const holdFor = (milliseconds: number): string => `setTimeout(() => {}, ${milliseconds})`;
const holdUntil = (path: string): string => `const t = setInterval(() => { if (require('fs').existsSync('${slashed(path)}')) clearInterval(t); }, 50)`;
const stampTo = (path: string): string => `require('fs').writeFileSync('${slashed(path)}', String(Date.now()))`;
const queueEntries = (repo: string): string[] => {
  const queue = join(repo, '.git/sdd-tests.queue');
  return existsSync(queue) ? readdirSync(queue).filter((name) => name.endsWith('.json')) : [];
};

function deadPid(): number {
  return Number(spawnSync(process.execPath, ['-e', 'console.log(process.pid)'], { encoding: 'utf8' }).stdout.trim());
}

describe('lock run', () => {
  it('makes a suite in another worktree of the clone wait for the running one, and says so', async () => {
    const { repo, other } = repoWithWorktree();
    const done = join(repo, 'first-done').replace(/\\/g, '/');
    const first = lockRun(repo, `setTimeout(() => require('fs').writeFileSync('${done}', ''), 3000)`);
    await until(() => existsSync(join(repo, '.git/sdd-tests.lock')));
    const second = await lockRun(other, `console.log(require('fs').existsSync('${done}') ? 'after' : 'before')`);
    expect((await first).code).toBe(0);
    expect(second.stdout).toBe('after');
    expect(second.stderr).toMatch(/Esperando el cerrojo de suites: vas 1\.º en la cola; lo tiene main \(.+, PID \d+\) desde /);
    expect(existsSync(join(repo, '.git/sdd-tests.lock'))).toBe(false);
  }, 60_000);

  it('exits with the code of the command', async () => {
    const { repo } = repoWithWorktree();
    expect((await lockRun(repo, 'process.exit(3)')).code).toBe(3);
  }, 60_000);

  it('runs a nested lock run without waiting when its parent holds the lock', async () => {
    const { repo } = repoWithWorktree();
    const lockFile = slashed(join(repo, '.git/sdd-tests.lock'));
    const inner = `require('child_process').spawnSync(process.execPath, ['${slashedBin}', 'lock', 'run', '--', process.execPath, '-e', 'console.log("inner")'], { stdio: 'inherit' }); console.log(JSON.parse(require('fs').readFileSync('${lockFile}', 'utf8')).pid === process.ppid ? 'outer holds it' : 'lost')`;
    const started = Date.now();
    const outer = await lockRun(repo, inner);
    expect(outer.code).toBe(0);
    expect(outer.stdout.split(/\r?\n/)).toEqual(['inner', 'outer holds it']);
    expect(outer.stderr).not.toMatch(/Esperando/);
    expect(Date.now() - started).toBeLessThan(30_000);
  }, 60_000);

  it('takes the lock as usual with an inherited owner and nobody holding it', async () => {
    const { repo } = repoWithWorktree();
    const lockFile = slashed(join(repo, '.git/sdd-tests.lock'));
    const own = `console.log(JSON.parse(require('fs').readFileSync('${lockFile}', 'utf8')).pid === process.ppid ? 'own lock' : 'no lock')`;
    const result = await lockRun(repo, own, { ...process.env, SDD_SUITE_LOCK_OWNER: String(process.pid) });
    expect(result.stdout).toBe('own lock');
  }, 60_000);

  it('asks for the lock when the inherited owner is not the holder', async () => {
    const { repo, other } = repoWithWorktree();
    const first = lockRun(repo, holdFor(2000));
    await until(() => existsSync(join(repo, '.git/sdd-tests.lock')));
    const second = await lockRun(other, 'console.log("ran")', { ...process.env, SDD_SUITE_LOCK_OWNER: '1' });
    await first;
    expect(second.stderr).toContain('Esperando el cerrojo de suites');
  }, 60_000);

  it('orders two waiters by arrival and lets the first one in', async () => {
    const { repo, other } = repoWithWorktree();
    const third = addWorktree(repo, 'feature/tercera', 'tercer-worktree');
    const secondStart = join(repo, 'second-start');
    const thirdStart = join(repo, 'third-start');
    const release = join(repo, 'release');
    const first = lockRun(repo, holdUntil(release));
    await until(() => existsSync(join(repo, '.git/sdd-tests.lock')));
    const second = lockRun(other, `${stampTo(secondStart)}; ${holdFor(1000)}`);
    await until(() => queueEntries(repo).length === 1);
    const lastRun = lockRun(third, stampTo(thirdStart));
    await until(() => queueEntries(repo).length === 2);
    writeFileSync(release, '');
    const last = await lastRun;
    await Promise.all([first, second]);
    expect(last.stderr).toMatch(/vas 2\.º en la cola; lo tiene main \(.+\) desde .+; delante de ti, feature\/otra \(/);
    expect(Number(readFileSync(secondStart, 'utf8'))).toBeLessThan(Number(readFileSync(thirdStart, 'utf8')));
  }, 60_000);

  it('records when the waiter took the lock, not when it arrived', async () => {
    const { repo, other } = repoWithWorktree();
    const lockFile = join(repo, '.git/sdd-tests.lock');
    const firstDone = join(repo, 'first-done');
    const first = lockRun(repo, `${holdFor(3000)}; process.on('exit', () => { ${stampTo(firstDone)} })`);
    await until(() => existsSync(lockFile));
    const second = lockRun(other, `console.log(JSON.parse(require('fs').readFileSync('${slashed(lockFile)}', 'utf8')).since)`);
    await first;
    const since = Date.parse((await second).stdout);
    expect(since).toBeGreaterThanOrEqual(Number(readFileSync(firstDone, 'utf8')) - 1000);
  }, 60_000);

  it('names a detached worktree without a blank branch', async () => {
    const { repo, other } = repoWithWorktree();
    const detached = join(repo, '..', 'desanclado');
    git(repo, ['worktree', 'add', '-q', '--detach', detached]);
    const first = lockRun(detached, holdFor(2000));
    await until(() => existsSync(join(repo, '.git/sdd-tests.lock')));
    const second = await lockRun(other, 'console.log("ran")');
    await first;
    expect(second.stderr).toMatch(/lo tiene \(.+desanclado, PID \d+\)/);
  }, 60_000);

  it('drops the queue entry of a dead waiter', async () => {
    const { repo } = repoWithWorktree();
    const pid = deadPid();
    const owner = { branch: 'feature/muerta', worktree: repo, pid, host: process.env.COMPUTERNAME ?? hostname(), since: new Date().toISOString() };
    mkdirSync(join(repo, '.git/sdd-tests.queue'));
    writeFileSync(join(repo, '.git/sdd-tests.queue', `${String(Date.now() - 1000).padStart(13, '0')}-${String(pid).padStart(10, '0')}.json`), JSON.stringify(owner));
    expect((await lockRun(repo, 'console.log("ran")')).code).toBe(0);
    expect(queueEntries(repo)).toEqual([]);
  }, 60_000);
});
