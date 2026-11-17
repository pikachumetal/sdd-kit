import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const INVALID = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('un motivo fuera de la lista no es válido', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), INVALID);
});

test('cancelar sin --motivo responde motivo no válido', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALID);
});

test('cancelar una reserva activa con motivo', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']),
    'cancelada Norte lun (sala ocupada)'
  );
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

// GIVEN: Norte lun quedó cancelada con «sala ocupada» por el test «cancelar una reserva activa con motivo».
test('canceladas enseña el motivo de cada cancelación', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
