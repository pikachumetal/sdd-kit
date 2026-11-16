import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run, bookings } from '../src/app.js';

test('informe lista cada cancelada bajo su sala con día, franja y motivo, y cierra con el total', () => {
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

test('informe no muestra las reservas activas', () => {
  assert.ok(!run('informe', []).includes('lun 10:00-12:00'));
});

test('informe sin canceladas responde «sin canceladas»', () => {
  bookings.splice(0, bookings.length, { room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' });
  assert.equal(run('informe', []), 'sin canceladas');
});
