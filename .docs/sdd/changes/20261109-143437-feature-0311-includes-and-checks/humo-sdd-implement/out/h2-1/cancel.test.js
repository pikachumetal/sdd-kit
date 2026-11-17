import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const INVALID = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('un motivo fuera de la lista se rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), INVALID);
});

test('sin --motivo se rechaza igual', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALID);
});

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña el motivo de cada cancelación', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
