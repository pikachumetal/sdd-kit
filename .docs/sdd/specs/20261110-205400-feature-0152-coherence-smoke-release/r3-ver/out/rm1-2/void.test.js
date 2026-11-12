import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('anular responde sin aviso', () => {
  assert.equal(run('anular', ['Norte', 'lun']), 'anulada Norte lun');
});
