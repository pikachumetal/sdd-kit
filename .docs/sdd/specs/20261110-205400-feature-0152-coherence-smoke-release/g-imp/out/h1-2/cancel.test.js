import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const INVALID = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar una reserva activa con motivo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), INVALID);
});

test('cancelar sin --motivo lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALID);
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña el motivo de la reserva cancelada', () => {
  // El estado del módulo es compartido: la cancelación de Norte lun ya puede haberla hecho un test anterior con el mismo motivo.
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
