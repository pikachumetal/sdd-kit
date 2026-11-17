import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('libres excluye la sala reservada en la franja', () => {
  assert.equal(run('libres', ['10:00-12:00']), 'Sur');
});

test('reservar crea la reserva', () => {
  assert.equal(run('reservar', ['Sur', '10:00-12:00']), 'reserva creada: Sur 10:00-12:00');
});

test('reservar --cada-semana crea la reserva semanal', () => {
  assert.equal(run('reservar', ['Norte', '--cada-semana']), 'reserva semanal creada');
});

test('cancelar respeta el día', () => {
  assert.equal(run('cancelar', ['mar', '10:00']), 'cancelada mar 10:00');
});
