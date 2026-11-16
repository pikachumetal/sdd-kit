import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('informe lista las canceladas por sala con su motivo y el total', () => {
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
