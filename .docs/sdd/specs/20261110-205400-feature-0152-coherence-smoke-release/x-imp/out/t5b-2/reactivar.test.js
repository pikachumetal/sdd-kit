import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

// El estado inicial de `bookings` trae la reserva de Norte del lun 10:00-12:00 cancelada.
// Los tests comparten el módulo y corren en orden: el primero es el que reactiva de verdad.

test('reactivar devuelve la reserva cancelada', () => {
  assert.equal(run('reactivar', ['Norte', 'lun']), 'reactivada Norte lun');
});

test('tras reactivar, Norte deja de salir en libres 10:00-12:00', () => {
  run('reactivar', ['Norte', 'lun']); // idempotente para este test: no depende del orden
  assert.ok(!run('libres', ['10:00-12:00']).split(', ').includes('Norte'));
});

test('reactivar sin cancelada lo dice', () => {
  assert.equal(run('reactivar', ['Sur', 'mar']), 'sin cancelada Sur mar');
});
