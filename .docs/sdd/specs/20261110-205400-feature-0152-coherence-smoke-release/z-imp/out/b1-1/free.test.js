import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run, addBooking } from '../src/app.js';

test('libres sin salas libres en la franja responde sin salas', () => {
  addBooking('Norte', 'mar', '16:00-18:00');
  addBooking('Sur', 'mar', '16:00-18:00');
  assert.equal(run('libres', ['16:00-18:00']), 'sin salas');
});
