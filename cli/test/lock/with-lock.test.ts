import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { memoryIo } from '../../src/cli/io.ts';
import { withLock } from '../../src/git/lock.ts';

const root = mkdtempSync(join(tmpdir(), 'with-lock-'));
afterEach(() => rmSync(root, { recursive: true, force: true }));

it('espera a un dueño que aún no ha escrito el cerrojo, sin romperlo', async () => {
  const lockPath = join(root, '.lock');
  writeFileSync(lockPath, '');
  let releasedByOwner = false;
  setTimeout(() => {
    releasedByOwner = true;
    rmSync(lockPath);
  }, 150);
  const lock = { path: lockPath, label: 'prueba', io: memoryIo(), owner: { branch: 'b', worktree: 'w' } };
  const ranAfterOwner = await withLock(lock, 1, async () => releasedByOwner);
  expect(ranAfterOwner).toBe(true);
  expect(existsSync(lockPath)).toBe(false);
});
