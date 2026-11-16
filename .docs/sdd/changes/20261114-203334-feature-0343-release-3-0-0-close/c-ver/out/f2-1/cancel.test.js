import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const INVALID_REASON = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), INVALID_REASON);
});

test('cancelar sin --motivo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALID_REASON);
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), INVALID_REASON);
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña sala, día y motivo', () => {
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
