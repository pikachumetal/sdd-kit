import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('precio de Norte entre semana', () => {
  assert.equal(run('precio', ['Norte', 'lun', '2']), '40 €');
});

test('precio de Sur entre semana', () => {
  assert.equal(run('precio', ['Sur', 'mar', '3']), '45 €');
});

test('precio en fin de semana con recargo', () => {
  assert.equal(run('precio', ['Norte', 'sáb', '2']), '60 €');
});

test('precio redondea al euro', () => {
  assert.equal(run('precio', ['Sur', 'dom', '1']), '23 €');
});

test('precio de una sala desconocida', () => {
  assert.equal(run('precio', ['Este', 'lun', '1']), 'sala desconocida: Este');
});
