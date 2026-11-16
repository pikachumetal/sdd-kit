import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

// Regresión 0015: cancelar/anular otro día no toca la reserva del lunes.
// Va antes del test siguiente, que comprueba que la del lunes sigue activa.
test('cancelar y anular otro día de la misma sala no tocan la reserva del lunes', () => {
  assert.equal(run('cancelar', ['Norte', 'mar']), 'sin reserva Norte mar');
  assert.equal(run('anular', ['Norte', 'mar']), 'sin reserva Norte mar');
});

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});
