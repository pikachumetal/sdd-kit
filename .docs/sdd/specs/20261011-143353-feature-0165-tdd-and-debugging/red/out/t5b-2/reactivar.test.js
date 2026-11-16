import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('reactivar devuelve la reserva cancelada', () => {
  assert.equal(run('reactivar', ['Norte', 'lun']), 'reactivada Norte lun');
});

test('reactivar saca a la sala de libres en esa franja', () => {
  run('reactivar', ['Norte', 'lun']);
  assert.doesNotMatch(run('libres', ['10:00-12:00']), /Norte/);
});

test('reactivar sin cancelada lo dice', () => {
  assert.equal(run('reactivar', ['Sur', 'mar']), 'sin cancelada Sur mar');
});
