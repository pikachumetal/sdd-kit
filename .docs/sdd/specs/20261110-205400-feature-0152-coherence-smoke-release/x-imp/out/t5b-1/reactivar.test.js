import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('reactivar devuelve la reserva cancelada', () => {
  assert.equal(run('reactivar', ['Norte', 'lun']), 'reactivada Norte lun');
});

test('tras reactivar, Norte deja de salir en libres', () => {
  // idempotente: si el test anterior ya reactivó, esta llamada no cambia nada
  run('reactivar', ['Norte', 'lun']);
  assert.ok(!run('libres', ['10:00-12:00']).includes('Norte'));
});

test('reactivar sin cancelada lo dice', () => {
  assert.equal(run('reactivar', ['Sur', 'mar']), 'sin cancelada Sur mar');
});
