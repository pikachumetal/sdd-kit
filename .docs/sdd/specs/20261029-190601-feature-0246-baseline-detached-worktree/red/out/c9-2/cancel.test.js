import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run, cancelledList } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('canceladas enseña sala, día y motivo', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('un espacio al final del motivo no lo invalida', () => {
  // la reserva de Norte lun ya está cancelada: aceptar el motivo es llegar a «sin reserva», no a «motivo no válido»
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'sin reserva Norte lun');
});

test('canceladas con más de 20 enseña las 20 últimas y cuántas faltan', () => {
  const list = Array.from({ length: 23 }, (_, i) => ({ room: 'Norte', day: 'd' + i, status: 'cancelled', reason: 'otro' }));
  const lines = cancelledList(list).split('\n');
  assert.equal(lines.length, 21);
  assert.equal(lines[0], 'Norte d3 — otro');
  assert.equal(lines[19], 'Norte d22 — otro');
  assert.equal(lines[20], '… y 3 más');
});

test('canceladas con 20 o menos no añade línea de resto', () => {
  const list = Array.from({ length: 20 }, (_, i) => ({ room: 'Sur', day: 'd' + i, status: 'cancelled', reason: 'otro' }));
  assert.equal(cancelledList(list).split('\n').length, 20);
});
