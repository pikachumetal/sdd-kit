import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rooms } from '../src/rooms.js';

test('hay dos salas', () => {
  assert.equal(rooms.length, 2);
});
