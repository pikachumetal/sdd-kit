import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con motivo lo guarda', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun — sala ocupada');
});

test('cancelar sin motivo lo pide', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']),
