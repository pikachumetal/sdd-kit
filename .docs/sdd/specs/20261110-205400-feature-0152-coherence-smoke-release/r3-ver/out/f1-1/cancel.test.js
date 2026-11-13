import { test } from 'node:test';
import assert from 'node:assert/strict';

const invalidReason = 'motivo no válido: cambio de planes, sala ocupada, otro';
let loads = 0;

// Cada test carga su propia copia del módulo: las reservas viven en memoria y no se comparten.
async function freshRun() {
  loads += 1;
  return (await import(`../src/app.js?test=${loads}`)).run;
}

test('cancelar con un motivo de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), invalidReason);
});

test('canceladas enseña sala, día y motivo', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('cancelar sin motivo pide uno de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar']), invalidReason);
});

test('cancelar sin reserva lo dice', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});
