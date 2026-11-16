import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar sin --motivo responde motivo no válido y no cancela', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  assert.equal(run('libres', ['10:00-12:00']), 'Sur');
});
