import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('reservar justo el máximo de horas se acepta', () => {
  assert.equal(run('reservar', ['Sur', '09:30-12:00']), 'reservada Sur 09:30-12:00');
});

test('reservar más del máximo se rechaza', () => {
  assert.equal(run('reservar', ['Sur', '09:00-12:30']), 'excede el máximo de horas');
});
