import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('informe lista cada cancelada bajo su sala con día, franja y motivo', () => {
  const lines = run('informe', []).split('\n');
  assert.deepEqual(lines.slice(0, 3), [
    'Norte: 2 canceladas',
    '  lun 10:00-12:00 — sala ocupada',
    '  mié 12:00-13:00 — otro',
  ]);
  assert.deepEqual(lines.slice(3, 5), [
    'Sur: 1 canceladas',
    '  mar 09:00-10:00 — cambio de planes',
  ]);
});

test('informe abre cada sala con su cuenta y cierra con el total', () => {
  const lines = run('informe', []).split('\n');
  assert.equal(lines.at(-1), 'Total: 3 canceladas');
  assert.equal(lines.filter((line) => /^\S.*: \d+ canceladas$/.test(line)).length, 3);
});

test('informe no incluye reservas activas', () => {
  const out = run('informe', []);
  assert.match(out, /lun 10:00-12:00/);
  assert.doesNotMatch(out, /jue/);
});
