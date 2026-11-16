import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('salas en orden', () => {
  assert.equal(run('salas', []), 'Norte, Sur');
});
