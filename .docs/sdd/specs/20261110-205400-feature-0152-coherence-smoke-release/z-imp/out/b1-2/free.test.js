import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run, bookings } from '../src/app.js';

test('libres sin salas libres en la franja responde sin salas', () => {
  bookings.push({ room: 'Sur', day: 'lun', slot: '10:00-12:00', status: 'active' });
  assert.equal(run('libres', ['10:00-12:00']), 'sin salas');
});
