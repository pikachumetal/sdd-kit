import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const INVALID_REASON = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']), INVALID_REASON);
});

test('cancelar sin --motivo lo rechaza igual', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALID_REASON);
});

test('cancelar con --motivo sin valor lo rechaza igual', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), INVALID_REASON);
});

test('cancelar una reserva activa con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('canceladas enseña la reserva cancelada con su motivo', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
