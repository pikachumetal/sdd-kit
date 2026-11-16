import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

// Va antes que el resto: el estado de las reservas se comparte dentro del fichero,
// y el test siguiente (cancelar Norte lun) comprueba que la del lunes sigue activa.
test('cancelar un día sin reserva no toca la de otro día', () => {
  assert.equal(run('cancelar', ['Norte', 'mar']), 'sin reserva Norte mar');
  assert.equal(run('anular', ['Norte', 'mar']), 'sin reserva Norte mar');
});

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});
