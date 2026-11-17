import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('el informe lista cada cancelada con su motivo, por sala', () => {
  const salida = run('informe', []);
  assert.equal(
    salida,
    [
      'Norte: 2 canceladas',
      '  mié 12:00-13:00 — otro',
      '  vie 10:00-12:00 — sala ocupada',
      'Sur: 1 canceladas',
      '  mar 09:00-10:00 — cambio de planes',
      'Total: 3 canceladas',
    ].join('\n'),
  );
});

test('el informe no incluye las reservas activas', () => {
  const salida = run('informe', []);
  assert.match(salida, /Total: 3 canceladas/);
  assert.doesNotMatch(salida, /lun 10:00-12:00/);
});
