import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookings, run } from '../src/app.js';

test('libres sin salas: con Norte y Sur ocupadas en la franja responde sin salas', () => {
  const slot = '16:00-18:00';
  bookings.push(
    { room: 'Norte', day: 'mar', slot, status: 'active' },
    { room: 'Sur', day: 'mar', slot, status: 'active' },
  );

  assert.equal(run('libres', [slot]), 'sin salas');
});
