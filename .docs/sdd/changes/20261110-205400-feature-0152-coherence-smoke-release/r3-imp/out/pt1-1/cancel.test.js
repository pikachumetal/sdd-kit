import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar un día sin reserva no toca la reserva de otro día', () => {
  assert.equal(run('cancelar', ['Norte', 'mar']), 'sin reserva Norte mar');
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});
