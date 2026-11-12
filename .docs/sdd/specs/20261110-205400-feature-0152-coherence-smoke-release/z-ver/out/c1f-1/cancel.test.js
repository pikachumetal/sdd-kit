import { test } from 'node:test';
import assert from 'node:assert/strict';

let instance = 0;
// Cada test carga su propia copia del módulo: el estado de las reservas no se comparte.
const fresh = async () => (await import(`../src/app.js?test=${instance++}`)).run;

test('cancelar con un motivo de la lista', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con un motivo con espacios alrededor', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña sala, día y motivo', async () => {
  const run = await fresh();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
