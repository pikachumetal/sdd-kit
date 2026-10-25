import { describe, it, expect } from 'vitest';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addWorktree, commit, git, tempDir } from '../ids/helpers.ts';

const bin = fileURLToPath(new URL('../../bin/sdd.js', import.meta.url));

type Result = { code: number | null; stdout: string; stderr: string };

function lockRun(cwd: string, script: string): Promise<Result> {
  const child = spawn(process.execPath, [bin, 'lock', 'run', '--', process.execPath, '-e', script], { cwd });
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

describe('lock run', () => {
  it('makes a suite in another worktree of the clone wait for the running one, and says so', async () => {
    const { repo, other } = repoWithWorktree();
    const done = join(repo, 'first-done').replace(/\\/g, '/');
    const first = lockRun(repo, `setTimeout(() => require('fs').writeFileSync('${done}', ''), 3000)`);
    await until(() => existsSync(join(repo, '.git/sdd-tests.lock')));
    const second = await lockRun(other, `console.log(require('fs').existsSync('${done}') ? 'after' : 'before')`);
    expect((await first).code).toBe(0);
    expect(second.stdout).toBe('after');
    expect(second.stderr).toMatch(/Esperando el cerrojo de suites: lo tiene main \(.+, PID \d+\) desde /);
    expect(existsSync(join(repo, '.git/sdd-tests.lock'))).toBe(false);
  }, 60_000);

  it('exits with the code of the command', async () => {
    const { repo } = repoWithWorktree();
    expect((await lockRun(repo, 'process.exit(3)')).code).toBe(3);
  }, 60_000);
});
