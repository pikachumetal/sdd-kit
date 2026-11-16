import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run, bookings } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('canceladas enseña sala, día y motivo', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('canceladas enseña como mucho las 20 últimas y cuenta el resto', () => {
  for (let i = 1; i <= 22; i++) bookings.push({ room: 'Sur', day: `d${i}`, status: 'cancelled', reason: 'otro' });
  const lines = run('canceladas', []).split('\n');
  assert.equal(lines.length, 21);
  assert.equal(lines[0], 'Sur d3 — otro');
  assert.equal(lines[19], 'Sur d22 — otro');
  assert.equal(lines[20], '… y 3 más');
});
