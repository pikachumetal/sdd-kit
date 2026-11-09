import { test } from 'node:test';
import assert from 'node:assert/strict';
import { failureReport } from '../src/attempt.js';

test('el informe nombra la sala', () => {
  assert.equal(failureReport('Norte'), 'fallo Norte');
});
