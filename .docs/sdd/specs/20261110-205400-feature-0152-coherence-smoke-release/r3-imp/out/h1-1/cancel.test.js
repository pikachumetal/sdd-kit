import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const INVALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

// El estado de las reservas vive en el módulo: los rechazos van antes de la cancelación que consume Norte lun.
test('un motivo fuera de la lista se rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'aburrimiento']), INVALIDO);
});

test('cancelar sin --motivo se rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALIDO);
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('cancelar una reserva activa con motivo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña el motivo', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
