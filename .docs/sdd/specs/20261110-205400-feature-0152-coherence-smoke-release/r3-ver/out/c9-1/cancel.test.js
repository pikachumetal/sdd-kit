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

test('el motivo con espacios alrededor se recorta antes de comprobarlo', () => {
  bookings.push({ room: 'Sur', day: 'mie', slot: '10:00-12:00', status: 'active' });
  assert.equal(run('cancelar', ['Sur', 'mie', '--motivo', ' sala ocupada ']), 'cancelada Sur mie (sala ocupada)');
});

test('canceladas enseña las 20 últimas canceladas, por orden de cancelación', () => {
  bookings.length = 0;
  for (let i = 0; i < 22; i++) bookings.push({ room: 'Sur', day: `e${i}`, slot: 'x', status: 'active' });
  for (let i = 1; i < 22; i++) run('cancelar', ['Sur', `e${i}`, '--motivo', 'otro']);
  run('cancelar', ['Sur', 'e0', '--motivo', 'otro']);
  const lines = run('canceladas', []).split('\n');
  assert.equal(lines.length, 21);
  assert.equal(lines[0], 'Sur e3 — otro');
  assert.equal(lines[19], 'Sur e0 — otro');
  assert.equal(lines[20], '… y 2 más');
});
