import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run, bookings } from '../src/app.js';

test('libres responde sin salas cuando Norte y Sur están ocupadas en la franja', (t) => {
  const slot = '14:00-16:00';
  const added = [
    { room: 'Norte', day: 'mar', slot, status: 'active' },
    { room: 'Sur', day: 'mar', slot, status: 'active' },
  ];
  bookings.push(...added);
  t.after(() => bookings.splice(bookings.length - added.length, added.length));

  assert.equal(run('libres', [slot]), 'sin salas');
});
