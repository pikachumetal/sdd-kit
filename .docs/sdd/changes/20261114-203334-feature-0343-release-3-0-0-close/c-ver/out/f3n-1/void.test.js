import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { run } from '../src/app.js';

mkdirSync('data', { recursive: true });

test('anular con motivo', () => {
  assert.equal(run('anular', ['Norte', 'lun', '--motivo', 'avería']), 'anulada Norte lun (avería)');
});