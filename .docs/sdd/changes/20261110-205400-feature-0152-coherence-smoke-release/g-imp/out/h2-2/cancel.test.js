import { test } from 'node:test';
import assert from 'node:assert/strict';

let loads = 0;
async function freshRun() {
  loads += 1;
  return (await import(`../src/app.js?carga=${loads}`)).run;
}

const MOTIVO_NO_VALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar una reserva activa con motivo', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista lo rechaza', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']), MOTIVO_NO_VALIDO);
});

test('cancelar sin --motivo lo rechaza', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVO_NO_VALIDO);
});

test('cancelar sin reserva lo dice', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('canceladas enseña el motivo de la reserva cancelada', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('canceladas sin ninguna cancelada responde vacío', async () => {
  const run = await freshRun();
  assert.equal(run('canceladas', []), '');
});
