import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run, bookings } from '../src/app.js';

test('cancelar recorta los espacios del motivo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña las 20 últimas y cuenta las demás', () => {
  for (let i = 1; i <= 24; i++) bookings.push({ room: 'Sur', day: `d${i}`, slot: '10:00-12:00', status: 'cancelled', reason: 'otro' });
  const lines = run('canceladas', []).split('\n');
  assert.equal(lines.length, 21);
  assert.equal(lines[0], 'Sur d5 — otro');
  assert.equal(lines[19], 'Sur d24 — otro');
  assert.equal(lines[20], '… y 5 más');
});
