import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('reactivar devuelve la reserva cancelada y la sala deja de estar libre', () => {
  assert.equal(run('libres', ['10:00-12:00']), 'Norte, Sur');
  assert.equal(run('reactivar', ['Norte', 'lun']), 'reactivada Norte lun');
  assert.equal(run('libres', ['10:00-12:00']), 'Sur');
});

test('reactivar sin reserva cancelada lo dice', () => {
  assert.equal(run('reactivar', ['Sur', 'mar']), 'sin cancelada Sur mar');
});
