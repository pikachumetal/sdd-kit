import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { memoryIo } from '../../src/cli/io.ts';
import { run } from '../../src/main.ts';
import { defaultConfig, description, newTranscript, newWorktree, readCall, touch } from './helpers.ts';
import { join } from 'node:path';
import { appendFileSync, existsSync, rmSync, writeFileSync } from 'node:fs';

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

describe('watch command sin --once', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] }));
  afterEach(() => vi.useRealTimers());

  async function writeEvery30s(log: string, minutes: number, line: (second: number) => string): Promise<void> {
    for (let second = 30; second <= minutes * 60; second += 30) {
      await vi.advanceTimersByTimeAsync(29_000);
      appendFileSync(log, line(second));
      touch(log, 0);
      await vi.advanceTimersByTimeAsync(1_000);
    }
  }

  const heartbeat = (second: number): string => `▮▮▮▮ kit:test-headless (running for ${second}s)\n`;

  function startCommand(setup: ReturnType<typeof newWorktree>, log: string) {
    const io = memoryIo();
    const finished = run(['watch', 'command', '--path', log, '--worktree', setup.repo], io);
    return { io, finished };
  }

  it('no cuenta el latido de moon como actividad y avisa al pasar longCommandMinutes', async () => {
    const setup = newWorktree(defaultConfig);
    const log = join(setup.repo, 'gate.log');
    writeFileSync(log, 'kit:test-headless | RUN tests\n');
    const { io, finished } = startCommand(setup, log);
    await writeEvery30s(log, 20.5, heartbeat);
    expect(io.stdout[0]).toBe('SILENCIO: gate.log lleva 20 min sin escribir (umbral 20 min, longCommandMinutes)');
    expect(await finished).toBe(0);
  });

  it('con -- lanza el comando y termina con él, sin SILENCIO', async () => {
    const setup = newWorktree(defaultConfig);
    const io = memoryIo();
    const code = await run(['watch', 'command', '--worktree', setup.repo, '--', 'node', '-e', 'setTimeout(()=>{},100)'], io);
    expect(code).toBe(0);
    expect(io.stdout[0]).toBe('TERMINADO: node -e setTimeout(()=>{},100) salió con 0');
    expect(io.stdout[1]).toMatch(/^salida: .*[\\/]\.temp[\\/]sdd[\\/]watch[\\/]\d{8}-\d{6}-\d+\.log$/);
    expect(io.stdout.join('\n')).not.toMatch(/SILENCIO:/);
  });

  it('con -- da SILENCIO al pasar longCommandMinutes y para el comando', async () => {
    const setup = newWorktree(defaultConfig);
    const marker = join(setup.repo, 'alive');
    const script = `setInterval(()=>require('fs').writeFileSync(${JSON.stringify(marker)},''),50)`;
    const io = memoryIo();
    const finished = run(['watch', 'command', '--worktree', setup.repo, '--', 'node', '-e', script], io);
    await vi.advanceTimersByTimeAsync(20.5 * 60_000);
    expect(await finished).toBe(0);
    expect(io.stdout[0]).toMatch(/^SILENCIO: node -e .* lleva 20 min sin escribir \(umbral 20 min, longCommandMinutes\)$/);
    vi.useRealTimers();
    await new Promise((done) => setTimeout(done, 500));
    rmSync(marker, { force: true });
    await new Promise((done) => setTimeout(done, 300));
    expect(existsSync(marker)).toBe(false);
  });

  it('una línea que no es latido sí cuenta como actividad', async () => {
    const setup = newWorktree(defaultConfig);
    const log = join(setup.repo, 'gate.log');
    writeFileSync(log, 'kit:test-headless | RUN tests\n');
    const { io } = startCommand(setup, log);
    await writeEvery30s(log, 15, heartbeat);
    await writeEvery30s(log, 0.5, () => 'kit:test-headless | ✓ test/x.test.ts\n');
    await writeEvery30s(log, 15, heartbeat);
    expect(io.stdout).toEqual([]);
  });
});
