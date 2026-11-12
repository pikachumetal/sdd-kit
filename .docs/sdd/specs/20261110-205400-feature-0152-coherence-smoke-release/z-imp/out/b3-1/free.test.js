import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('libres responde sin salas cuando Norte y Sur están ocupadas en la franja', () => {
  assert.equal(run('libres', ['16:00-18:00']), 'sin salas');
});
