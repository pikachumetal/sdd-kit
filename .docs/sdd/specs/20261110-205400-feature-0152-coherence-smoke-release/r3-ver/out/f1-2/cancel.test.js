import { test } from 'node:test';
import assert from 'node:assert/strict';

const INVALID_REASON = 'motivo no válido: cambio de planes, sala ocupada, otro';
let instances = 0;

// Cada test trabaja con su propia copia del módulo: las reservas viven en memoria (ADR 0003).
async function freshRun() {
  const { run } = await import(`../src/app.js?instancia=${instances++}`);
  return run;
}

test('cancelar con un motivo de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista no cancela la reserva', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']), INVALID_REASON);
  assert.equal(run('canceladas', []), '');
});

test('cancelar sin --motivo responde lo mismo y no cancela la reserva', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALID_REASON);
  assert.equal(run('canceladas', []), '');
});

test('cancelar con motivo válido una reserva que no existe lo dice', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña sala, día y motivo', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
