import { test } from 'node:test';
import assert from 'node:assert/strict';

const invalidReason = 'motivo no válido: cambio de planes, sala ocupada, otro';
let loads = 0;

// Cada test parte de sus propias reservas: el módulo las guarda en memoria.
async function freshRun() {
  loads += 1;
  const { run } = await import(`../src/app.js?test=${loads}`);
  return run;
}

test('cancelar con un motivo de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con espacios alrededor del motivo', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), invalidReason);
});

test('cancelar sin motivo', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun']), invalidReason);
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), invalidReason);
});

test('canceladas enseña sala, día y motivo', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
