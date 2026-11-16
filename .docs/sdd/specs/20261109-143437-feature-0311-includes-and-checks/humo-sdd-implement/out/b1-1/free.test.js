import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run, bookings } from '../src/app.js';

test('libres con Norte y Sur ocupadas responde sin salas', () => {
  bookings.push(
    { room: 'Norte', day: 'mar', slot: '16:00-18:00', status: 'active' },
    { room: 'Sur', day: 'mar', slot: '16:00-18:00', status: 'active' },
  );
  assert.equal(run('libres', ['16:00-18:00']), 'sin salas');
});
