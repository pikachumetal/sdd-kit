import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('horas suma las reservas activas de la sala', () => {
  assert.equal(run('horas', ['Norte']), 'Norte: 2 h');
});

test('horas no cuenta una reserva cancelada', () => {
  assert.equal(run('horas', ['Sur']), 'Sur: 0 h');
});
