import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const origin = process.cwd();
const dir = mkdtempSync(join(tmpdir(), 'salas-'));
process.chdir(dir);
const { run } = await import('../src/app.js');

after(() => {
  process.chdir(origin);
  rmSync(dir, { recursive: true, force: true });
});

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});
