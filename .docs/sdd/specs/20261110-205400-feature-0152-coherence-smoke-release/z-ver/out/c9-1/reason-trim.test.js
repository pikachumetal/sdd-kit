import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar recorta los espacios del motivo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', ' sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
});
