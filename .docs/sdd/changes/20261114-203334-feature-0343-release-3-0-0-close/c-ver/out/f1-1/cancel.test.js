import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const invalidReason = 'motivo no válido: cambio de planes, sala ocupada, otro';

// Va la primera: bookings es estado del módulo y solo aquí Norte lun sigue activa.
test('cancelar no toca la reserva de otro día', () => {
  assert.equal(run('cancelar', ['Norte', 'mar', '--motivo', 'otro']), 'sin reserva Norte mar');
});

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), invalidReason);
});

test('cancelar sin --motivo responde lo mismo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), invalidReason);
});

test('cancelar sin reserva lo dice, con un motivo válido', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña sala, día y motivo', () => {
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
