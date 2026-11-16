import { test } from 'node:test';
import assert from 'node:assert/strict';

let fresh = 0;
// Cada test parte de las reservas iniciales: el estado vive en el módulo.
async function app() {
  fresh += 1;
  return import(`../src/app.js?fresh=${fresh}`);
}

test('cancelar una reserva activa con motivo de la lista', async () => {
  const { run } = await app();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar sin reserva lo dice', async () => {
  const { run } = await app();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'sala ocupada']), 'sin reserva Sur mar');
});

test('cancelar con un motivo fuera de la lista lo rechaza', async () => {
  const { run } = await app();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar sin --motivo lo rechaza', async () => {
  const { run } = await app();
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('canceladas enseña la reserva cancelada con su motivo', async () => {
  const { run } = await app();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
