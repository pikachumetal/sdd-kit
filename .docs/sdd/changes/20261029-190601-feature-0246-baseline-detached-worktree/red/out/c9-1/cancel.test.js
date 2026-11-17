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

test('cancelar acepta el motivo con espacios alrededor', () => {
  assert.doesNotMatch(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), /^motivo no válido/);
});

const cancelled = (n) => Array.from({ length: n }, (_, i) => ({ room: 'Norte', day: `d${i + 1}`, status: 'cancelled', reason: 'otro' }));

test('canceladas enseña las 20 últimas y cuenta el resto', () => {
  const lines = cancelledList(cancelled(23)).split('\n');
  assert.equal(lines.length, 21);
  assert.equal(lines[0], 'Norte d4 — otro');
  assert.equal(lines[19], 'Norte d23 — otro');
  assert.equal(lines[20], '… y 3 más');
});

test('canceladas con 20 no añade la línea de más', () => {
  assert.equal(cancelledList(cancelled(20)).split('\n').length, 20);
});
