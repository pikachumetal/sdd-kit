import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('informe lista cada cancelada bajo su sala, con día, franja y motivo', () => {
  assert.deepEqual(run('informe', []).split('\n'), [
    'Norte: 2 canceladas',
    '  lun 10:00-12:00 — sala ocupada',
    '  mié 12:00-13:00 — otro',
    'Sur: 1 canceladas',
    '  mar 09:00-10:00 — cambio de planes',
    'Total: 3 canceladas',
  ]);
});

test('informe abre cada sala con su cuenta y cierra con el total', () => {
  const lines = run('informe', []).split('\n');
  assert.ok(lines.includes('Norte: 2 canceladas'));
  assert.ok(lines.includes('Sur: 1 canceladas'));
  assert.equal(lines.at(-1), 'Total: 3 canceladas');
});

test('informe no muestra una reserva activa', () => {
  const report = run('informe', []);
  assert.ok(report.includes('Sur: 1 canceladas'));
  assert.ok(!report.includes('jue'));
});
