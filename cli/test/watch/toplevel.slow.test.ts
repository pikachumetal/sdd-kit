import { describe, it, expect, vi, afterEach } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';
import { defaultConfig, newTranscript, newWorktree, readCall, description } from './helpers.ts';

const cleanEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));

afterEach(() => vi.restoreAllMocks());

describe('watch subagent sin --worktree', () => {
  it('toma el worktree de la raíz del repo aunque se lance desde un subdirectorio', async () => {
    const setup = newWorktree(defaultConfig);
    spawnSync('git', ['init', '-q'], { cwd: setup.repo, env: cleanEnv });
    newTranscript(setup, [readCall()], 8.5);
    const sub = join(setup.repo, 'src');
    mkdirSync(sub);
    vi.spyOn(process, 'cwd').mockReturnValue(sub);
    const io = memoryIo();
    await run(['watch', 'subagent', '--projects-root', setup.projects, '--once', '--description', description], io);
    expect(io.stdout[0]).toMatch(/^SILENCIO:/);
  });
});
