import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freeRoomsAnswer } from '../src/app.js';

test('libres con Norte y Sur ocupadas en la franja responde sin salas', () => {
  const store = [
    { room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' },
    { room: 'Sur', day: 'lun', slot: '10:00-12:00', status: 'active' },
  ];

  assert.equal(freeRoomsAnswer('10:00-12:00', store), 'sin salas');
});
