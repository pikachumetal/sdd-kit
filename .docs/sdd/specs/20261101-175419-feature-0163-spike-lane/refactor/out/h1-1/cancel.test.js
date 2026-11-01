import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const INVALID_REASON = 'motivo no válido: cambio de planes, sala ocupada, otro';

// Los rechazos no cancelan nada: van antes del test que sí cancela la reserva de Norte.
test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), INVALID_REASON);
});

test('cancelar sin --motivo lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALID_REASON);
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('cancelar una reserva activa con motivo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña el motivo de cada reserva cancelada', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
