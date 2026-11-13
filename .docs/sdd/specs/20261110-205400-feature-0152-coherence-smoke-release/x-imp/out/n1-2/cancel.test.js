import { test } from 'node:test';
import assert from 'node:assert/strict';

let loads = 0;

// Cada test parte de las reservas iniciales: las reservas viven en el módulo.
async function freshRun() {
  loads += 1;
  const { run } = await import(`../src/app.js?test=${loads}`);
  return run;
}

test('cancelar con un motivo de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista lo rechaza', async () => {
  const run = await freshRun();
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
});

test('cancelar sin --motivo lo rechaza', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('canceladas enseña la reserva cancelada con su motivo', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('cancelar sin reserva lo dice', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});
