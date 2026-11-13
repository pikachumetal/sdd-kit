import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const INVALID = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con motivo de la lista lo muestra', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'porque sí']), INVALID);
});

test('cancelar sin --motivo lo rechaza', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), INVALID);
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

// Depende de la reserva de Norte lun cancelada en el primer test de este fichero (estado compartido del módulo).
test('canceladas enseña el motivo', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
