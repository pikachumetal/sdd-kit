import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { hostname, tmpdir } from 'node:os';
import { join } from 'node:path';
import { waitersAhead } from '../../src/git/lock.ts';

const entryName = (milliseconds: number, pid: number): string => `${String(milliseconds).padStart(13, '0')}-${String(pid).padStart(10, '0')}.json`;

function plant(queue: string, milliseconds: number, pid: number, branch: string): string {
  const path = join(queue, entryName(milliseconds, pid));
  const owner = { branch, worktree: queue, pid, host: process.env.COMPUTERNAME ?? hostname(), since: new Date(milliseconds).toISOString() };
  writeFileSync(path, JSON.stringify(owner));
  return path;
}

describe('waitersAhead', () => {
  it('orders two waiters of the same millisecond by PID', () => {
    const queue = mkdtempSync(join(tmpdir(), 'lock-queue-'));
    const arrival = 1_793_000_000_000;
    const [low, high] = [process.pid, process.ppid].sort((a, b) => a - b);
    plant(queue, arrival, high, 'feature/alta');
    plant(queue, arrival, low, 'feature/baja');
    const own = plant(queue, arrival + 1, low, 'feature/propia');
    expect(waitersAhead(queue, own).map((owner) => owner.branch)).toEqual(['feature/baja', 'feature/alta']);
  });

  it('skips an entry still being written', () => {
    const queue = mkdtempSync(join(tmpdir(), 'lock-queue-'));
    writeFileSync(join(queue, `${entryName(1, process.pid)}.tmp`), '{');
    const own = plant(queue, 2, process.pid, 'feature/propia');
    expect(waitersAhead(queue, own)).toEqual([]);
  });
});
