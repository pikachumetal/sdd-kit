import { mkdirSync, mkdtempSync, existsSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { gitSync } from '../src/git/git.ts';
import { sweepRunFolders } from './temp-setup.ts';

const HOUR_MS = 60 * 60 * 1000;
const slashed = (path: string): string => resolve(path).replaceAll('\\', '/');
const repoTemp = slashed(resolve(import.meta.dirname, '..', '..', '.temp'));

describe('run folder under .temp', () => {
  it('tmpdir lives in the run folder under .temp', () => {
    expect(slashed(tmpdir())).toMatch(new RegExp(`^${repoTemp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/vitest-[^/]+$`, 'i'));
  });

  it('git does not climb into .temp', () => {
    expect(process.env.GIT_CEILING_DIRECTORIES).toMatch(/[\\/]\.temp$/);
    const plain = mkdtempSync(join(tmpdir(), 'ceil-'));
    expect(gitSync(plain, ['rev-parse', '--show-toplevel'])).toBeNull();
  });

  it('sweeps only run folders older than a day', () => {
    const tempRoot = mkdtempSync(join(tmpdir(), 'sweep-'));
    const now = Date.now();
    const stale = join(tempRoot, 'vitest-stale');
    const fresh = join(tempRoot, 'vitest-fresh');
    const other = join(tempRoot, 'probe');
    for (const dir of [stale, fresh, other]) mkdirSync(dir);
    const old = new Date(now - 25 * HOUR_MS);
    utimesSync(stale, old, old);
    utimesSync(other, old, old);

    sweepRunFolders(tempRoot, now);

    expect([existsSync(stale), existsSync(fresh), existsSync(other)]).toEqual([false, true, true]);
  });
});
