import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const informe = [
  'Norte: 2 canceladas',
  '  mié 12:00-13:00 — otro',
  '  vie 10:00-12:00 — sala ocupada',
  'Sur: 1 canceladas',
  '  mar 09:00-10:00 — cambio de planes',
  'Total: 3 canceladas',
].join('\n');

test('informe lista cada cancelada con su motivo, por sala y en orden de semana', () => {
  assert.equal(run('informe', []), informe);
});

test('informe no incluye reservas activas', () => {
  assert.doesNotMatch(run('informe', []), /lun 10:00-12:00/);
});
