import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const lines = () => run('informe', []).split('\n');

test('informe lista cada cancelada bajo su sala con día, franja y motivo, en orden', () => {
  assert.deepEqual(lines(), [
    'Norte: 2 canceladas',
    '  mié 12:00-13:00 — otro',
    '  vie 10:00-12:00 — sala ocupada',
    'Sur: 1 canceladas',
    '  mar 09:00-10:00 — cambio de planes',
    'Total: 3 canceladas',
  ]);
});

test('informe abre cada sala con su cuenta y cierra con el total', () => {
  const out = lines();
  assert.ok(out.includes('Norte: 2 canceladas'));
  assert.ok(out.includes('Sur: 1 canceladas'));
  assert.equal(out.at(-1), 'Total: 3 canceladas');
});

test('informe no enseña una reserva activa', () => {
  assert.ok(!run('informe', []).includes('lun 10:00-12:00'));
});
