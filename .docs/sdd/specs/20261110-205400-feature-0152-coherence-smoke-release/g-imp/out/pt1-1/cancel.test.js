import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

// El estado vive en memoria y se comparte en el fichero: este test va antes del que cancela Norte lun.
test('cancelar un día sin reserva no toca la de otro día', () => {
  assert.equal(run('cancelar', ['Norte', 'mar']), 'sin reserva Norte mar');
  assert.equal(run('libres', ['10:00-12:00']), 'Sur');
});

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});
