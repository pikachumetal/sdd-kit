import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('informe lista cada cancelada con su motivo, por sala', () => {
  assert.equal(
    run('informe', []),
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

test('informe no incluye las reservas activas', () => {
  const informe = run('informe', []);
  assert.ok(informe.includes('vie 10:00-12:00'));
  assert.ok(!informe.includes('lun 10:00-12:00'));
});
