import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

// La reserva de Norte del lun 10:00-12:00 arranca cancelada (src/app.js).
// Los tests corren en orden y comparten ese estado: el primero la reactiva.

test('reactivar devuelve la reserva cancelada', () => {
  assert.equal(run('reactivar', ['Norte', 'lun']), 'reactivada Norte lun');
});

test('tras reactivar, Norte deja de salir en libres 10:00-12:00', () => {
  run('reactivar', ['Norte', 'lun']); // idempotente como preparación: ya reactivada o no
  assert.ok(!run('libres', ['10:00-12:00']).split(', ').includes('Norte'));
});

test('reactivar sin cancelada lo dice', () => {
  assert.equal(run('reactivar', ['Sur', 'mar']), 'sin cancelada Sur mar');
});
