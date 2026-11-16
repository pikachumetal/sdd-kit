import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attempt } from '../src/attempt.js';

test('un intento fallido en la comprobación lenta nombra la sala', { timeout: 60000 }, () => {
  assert.equal(attempt('Norte'), 'fallo Norte');
});
