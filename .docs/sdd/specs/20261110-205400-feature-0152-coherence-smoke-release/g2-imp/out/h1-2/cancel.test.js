import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const INVALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), INVALIDO);
});

test('cancelar sin --motivo lo rechaza igual', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALIDO);
});

test('cancelar con motivo de la lista responde con el motivo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('canceladas enseña el motivo de la reserva cancelada', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
