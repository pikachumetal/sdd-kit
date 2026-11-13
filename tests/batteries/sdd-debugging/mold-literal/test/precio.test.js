import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('precio de dos horas en Norte', () => {
  assert.equal(run('precio', ['Norte', '10:00-12:00']), '40 €');
});
