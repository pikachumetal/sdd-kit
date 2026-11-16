import { test } from 'node:test';
import assert from 'node:assert/strict';

const invalidReason = 'motivo no válido: cambio de planes, sala ocupada, otro';
let instance = 0;

async function freshApp() {
  instance += 1;
  const { run } = await import(`../src/app.js?instancia=${instance}`);
  return run;
}

test('cancelar con un motivo de la lista', async () => {
  const run = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista deja la reserva activa', async () => {
  const run = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']), invalidReason);
  assert.equal(run('libres', ['10:00-12:00']), 'Sur');
  assert.equal(run('canceladas', []), '');
});

test('cancelar sin --motivo responde motivo no válido', async () => {
  const run = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun']), invalidReason);
  assert.equal(run('libres', ['10:00-12:00']), 'Sur');
});

test('cancelar sin reserva lo dice, con motivo válido', async () => {
  const run = await freshApp();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('cancelar otro día de la misma franja no toca la reserva', async () => {
  const run = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'mar', '--motivo', 'otro']), 'sin reserva Norte mar');
  assert.equal(run('libres', ['10:00-12:00']), 'Sur');
});

test('canceladas enseña sala, día y motivo', async () => {
  const run = await freshApp();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
