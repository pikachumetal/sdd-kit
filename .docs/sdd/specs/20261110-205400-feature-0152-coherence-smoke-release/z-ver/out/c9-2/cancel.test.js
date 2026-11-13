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

test('cancelar recorta los espacios del motivo', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'sala ocupada ']), 'sin reserva Sur mar');
});

test('canceladas enseña las 20 últimas y cuenta el resto', () => {
  const all = Array.from({ length: 23 }, (_, i) => ({ room: 'Sur', day: `d${i + 1}`, status: 'cancelled', reason: 'otro' }));
  const lines = cancelledList(all).split('\n');
  assert.equal(lines.length, 21);
  assert.equal(lines[0], 'Sur d4 — otro');
  assert.equal(lines[19], 'Sur d23 — otro');
  assert.equal(lines[20], '… y 3 más');
});

test('canceladas con 20 o menos no añade línea de resto', () => {
  const all = Array.from({ length: 20 }, (_, i) => ({ room: 'Sur', day: `d${i}`, status: 'cancelled', reason: 'otro' }));
  assert.equal(cancelledList(all).split('\n').length, 20);
});
