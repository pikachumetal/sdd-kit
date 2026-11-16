import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

// Proceso propio: el estado de las reservas es del módulo y cancel.test.js lo cambia.
test('canceladas sin canceladas dice «sin canceladas»', () => {
  assert.equal(run('canceladas', []), 'sin canceladas');
});
