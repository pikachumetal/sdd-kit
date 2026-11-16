import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con motivo válido y sin --por', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'falta quién cancela: usa --por <nombre>');
});

test('cancelar sin --motivo responde el motivo antes que --por', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar una reserva que no existe lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro', '--por', 'Ana']), 'sin reserva Sur mar');
});

test('canceladas enseña sala, día, motivo y quién canceló', () => {
  // GIVEN: la reserva de Norte del lunes que cancela el primer test, por Ana con «sala ocupada»
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada — Ana');
});
