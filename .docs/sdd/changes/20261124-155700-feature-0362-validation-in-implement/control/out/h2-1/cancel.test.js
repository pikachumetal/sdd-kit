import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const MOTIVO_NO_VALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

// El estado de las reservas es de módulo: los tests que no deben cancelar
// Norte lun van antes del que la cancela.
test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), MOTIVO_NO_VALIDO);
});

test('cancelar sin --motivo lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVO_NO_VALIDO);
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('cancelar una reserva activa con motivo', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']),
    'cancelada Norte lun (sala ocupada)',
  );
});

test('canceladas enseña la sala, el día y el motivo', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
