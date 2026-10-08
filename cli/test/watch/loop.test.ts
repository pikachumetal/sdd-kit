import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';
import { defaultConfig, description, newTranscript, newWorktree, readCall, touch } from './helpers.ts';
import { join } from 'node:path';

function startWatching(setup: ReturnType<typeof newWorktree>, name = description) {
  const io = memoryIo();
  const finished = run(['watch', 'subagent', '--description', name, '--worktree', setup.repo, '--projects-root', setup.projects], io);
  return { io, finished };
}

describe('watch subagent sin --once', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'Date'] }));
  afterEach(() => vi.useRealTimers());

  it('sigue mirando cada 30 s y termina con SILENCIO al pasar el umbral', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [readCall()], 7.8);
    const { io, finished } = startWatching(setup);
    await vi.advanceTimersByTimeAsync(29_000);
    expect(io.stdout).toEqual([]);
    await vi.advanceTimersByTimeAsync(1_000);
    expect(await finished).toBe(0);
    expect(io.stdout[0]).toBe('SILENCIO: Revisor final 0095 lleva 8 min sin escribir (umbral 8 min, betweenStepsMinutes)');
  });

  it('no avisa mientras el transcript siga escribiéndose', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [readCall()], 7.8);
    const { io, finished } = startWatching(setup);
    await vi.advanceTimersByTimeAsync(25_000);
    touch(join(setup.folder, 'agent-t1.jsonl'), 0);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(io.stdout).toEqual([]);
    touch(join(setup.folder, 'agent-t1.jsonl'), 20);
    await vi.advanceTimersByTimeAsync(30_000);
    await finished;
    expect(io.stdout[0]).toMatch(/^SILENCIO:/);
  });

  it('espera 2 min al transcript y entonces dice SIN TRANSCRIPT', async () => {
    const setup = newWorktree(defaultConfig);
    const { io, finished } = startWatching(setup);
    await vi.advanceTimersByTimeAsync(119_000);
    expect(io.stdout).toEqual([]);
    await vi.advanceTimersByTimeAsync(31_000);
    await finished;
    expect(io.stdout).toEqual([`SIN TRANSCRIPT: ${description}; el vigía de silencio no funciona en esta sesión`]);
  });

  it('encuentra el transcript que aparece durante la espera', async () => {
    const setup = newWorktree(defaultConfig);
    const { io, finished } = startWatching(setup);
    await vi.advanceTimersByTimeAsync(40_000);
    newTranscript(setup, [readCall()], 9);
    await vi.advanceTimersByTimeAsync(30_000);
    await finished;
    expect(io.stdout[0]).toMatch(/^SILENCIO:/);
  });

  it('descarta un despacho de hace más de 60 s antes de arrancar el vigía', async () => {
    const setup = newWorktree(defaultConfig);
    newTranscript(setup, [readCall()], 1);
    touch(join(setup.folder, 'agent-t1.meta.json'), 5);
    const { io, finished } = startWatching(setup);
    await vi.advanceTimersByTimeAsync(150_000);
    await finished;
    expect(io.stdout[0]).toMatch(/^SIN TRANSCRIPT:/);
  });
});
