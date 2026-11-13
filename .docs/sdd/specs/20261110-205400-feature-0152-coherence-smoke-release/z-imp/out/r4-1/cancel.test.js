import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar sin motivo no cancela y la reserva sigue activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  assert.equal(run('libres', ['10:00-12:00']), 'Sur');
});

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con motivo válido una reserva que no existe', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña sala, día y motivo', () => {
  // GIVEN propio: si otro test ya canceló Norte lun, aquí devuelve «sin reserva» y el estado es el mismo.
  const given = run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.ok(['cancelada Norte lun (sala ocupada)', 'sin reserva Norte lun'].includes(given));
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
