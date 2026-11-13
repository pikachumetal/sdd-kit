import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { hostname, tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { memoryIo } from '../../src/cli/io.ts';
import { withLock } from '../../src/git/lock.ts';

const root = mkdtempSync(join(tmpdir(), 'with-lock-'));
afterEach(() => rmSync(root, { recursive: true, force: true }));

function lockFile(content: string): string {
  mkdirSync(root, { recursive: true });
  const lockPath = join(root, '.lock');
  writeFileSync(lockPath, content);
  return lockPath;
}

it('espera a un dueño que aún no ha escrito el cerrojo, sin romperlo', async () => {
  const lockPath = lockFile('');
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

// Un PID vivo que arrancó después del «desde» es de otro programa: el sistema reutilizó el número (batería de la 0152, steam.exe).
const heldBy = (since: string) => JSON.stringify({ branch: 'b', worktree: 'otra', pid: process.pid, host: process.env.COMPUTERNAME ?? hostname(), since });

it('rompe el cerrojo de un PID vivo que arrancó después de cogerlo', async () => {
  const io = memoryIo();
  const lock = { path: lockFile(heldBy('2000-01-01T00:00:00.000Z')), label: 'prueba', io, owner: { branch: 'b', worktree: 'w' } };
  expect(await withLock(lock, 0.2, async () => 'dentro')).toBe('dentro');
  expect(io.stderr.join('\n')).toContain('Cerrojo huérfano');
}, 15_000);

// El arranque se mira a partir de los 3 s de espera: con 6 s de tope, la prueba pasa por él.
it('espera a un PID vivo que ya corría cuando cogió el cerrojo', async () => {
  const lock = { path: lockFile(heldBy(new Date().toISOString())), label: 'prueba', io: memoryIo(), owner: { branch: 'b', worktree: 'w' } };
  await expect(withLock(lock, 0.1, async () => 'dentro')).rejects.toThrow('no se libera');
}, 15_000);
