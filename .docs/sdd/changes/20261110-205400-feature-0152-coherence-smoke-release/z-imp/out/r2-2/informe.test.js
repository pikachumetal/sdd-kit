import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run, bookings } from '../src/app.js';

test('el informe lista cada cancelada bajo su sala con día, franja y motivo, y el total', () => {
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

test('una reserva activa no aparece en el informe', () => {
  assert.doesNotMatch(run('informe', []), /lun 10:00-12:00/);
});

test('sin canceladas el informe responde «sin canceladas»', () => {
  bookings.length = 0;
  assert.equal(run('informe', []), 'sin canceladas');
});
