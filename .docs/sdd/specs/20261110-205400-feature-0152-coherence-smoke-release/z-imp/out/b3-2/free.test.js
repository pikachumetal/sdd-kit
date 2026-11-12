import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('libres con Norte y Sur ocupadas en la franja responde sin salas', () => {
  assert.equal(run('libres', ['16:00-18:00']), 'sin salas');
});
