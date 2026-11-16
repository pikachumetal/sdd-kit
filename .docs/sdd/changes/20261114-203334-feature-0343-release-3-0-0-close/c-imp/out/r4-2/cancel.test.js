import { test } from 'node:test';
import assert from 'node:assert/strict';

let instance = 0;

// Una instancia nueva del módulo por test: cada uno parte de las reservas iniciales.
async function freshRun() {
  const { run } = await import(`../src/app.js?test=${instance++}`);
  return run;
}

test('cancelar con un motivo de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar sin motivo responde lo mismo que con un motivo fuera de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con un motivo válido una reserva que no existe', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña sala, día y motivo', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
