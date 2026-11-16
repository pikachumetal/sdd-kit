import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

// Va antes que el de `lun`: comparten el estado del módulo, y ese de `lun`
// comprueba además que la reserva del lunes sigue activa.
test('cancelar otro día sin reserva lo dice y no toca la del lunes', () => {
  assert.equal(run('cancelar', ['Norte', 'mar']), 'sin reserva Norte mar');
});

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});
