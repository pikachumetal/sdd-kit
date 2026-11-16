import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('cancelar un día sin reserva no cancela la de otro día', async () => {
  const { run: fresh } = await import('../src/app.js?regresion-0015');
  assert.equal(fresh('cancelar', ['Norte', 'mar']), 'sin reserva Norte mar');
  assert.equal(fresh('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('anular un día sin reserva no anula la de otro día', async () => {
  const { run: fresh } = await import('../src/app.js?regresion-0015-anular');
  assert.equal(fresh('anular', ['Norte', 'mar']), 'sin reserva Norte mar');
  assert.equal(fresh('anular', ['Norte', 'lun']), 'anulada Norte lun');
});
