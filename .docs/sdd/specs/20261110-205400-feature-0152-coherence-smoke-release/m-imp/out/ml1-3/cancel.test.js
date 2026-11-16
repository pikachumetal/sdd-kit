import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from '../src/app.js';

const origen = process.cwd();
let dir;

before(() => {
  dir = mkdtempSync(join(tmpdir(), 'salas-'));
  process.chdir(dir);
});

after(() => {
  process.chdir(origen);
  rmSync(dir, { recursive: true, force: true });
});

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});
