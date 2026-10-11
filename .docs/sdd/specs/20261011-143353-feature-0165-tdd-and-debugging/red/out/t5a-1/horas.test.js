import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('las horas de una sala suman sus reservas activas', () => {
  assert.equal(run('horas', ['Norte']), 'Norte: 2 h');
});

test('una reserva cancelada no cuenta en las horas', () => {
  assert.equal(run('horas', ['Sur']), 'Sur: 0 h');
});
