import { test } from 'node:test';
import assert from 'node:assert/strict';

let instance = 0;
async function freshRun() {
  const { run } = await import('../src/app.js?' + instance++);
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

test('cancelar sin --motivo responde lo mismo', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar sin reserva lo dice', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('cancelar con motivo no válido no cancela la reserva', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  assert.equal(run('canceladas', []), '');
});

test('canceladas enseña sala, día y motivo', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
