import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookings, run } from '../src/app.js';

test('libres responde sin salas con Norte y Sur ocupadas en la franja', () => {
  bookings.push({ room: 'Sur', day: 'lun', slot: '10:00-12:00', status: 'active' });

  assert.equal(run('libres', ['10:00-12:00']), 'sin salas');
});
