import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const MOTIVO_NO_VALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me apetece']), MOTIVO_NO_VALIDO);
});

test('cancelar sin --motivo lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVO_NO_VALIDO);
});

test('cancelar con --motivo sin valor lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), MOTIVO_NO_VALIDO);
});

test('cancelar con un motivo de la lista cancela y lo dice', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});
