import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

// El estado de reservas es del módulo: cada test importa una copia limpia.
async function fresh(tag) {
  return import('../src/app.js?' + tag);
}

test('cancelar otro día no toca la reserva de otro día', async () => {
  const { run } = await fresh('cancelar-otro-dia');
  assert.equal(run('cancelar', ['Norte', 'mar']), 'sin reserva Norte mar');
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('anular otro día no toca la reserva de otro día', async () => {
  const { run } = await fresh('anular-otro-dia');
  assert.equal(run('anular', ['Norte', 'mar']), 'sin reserva Norte mar');
  assert.equal(run('anular', ['Norte', 'lun']), 'anulada Norte lun');
});
