import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attempt } from '../src/attempt.js';

test('un intento que no pasa la comprobación lenta nombra la sala', () => {
  assert.equal(attempt('Norte'), 'fallo Norte');
});
