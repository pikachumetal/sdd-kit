import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run, cancelledReport } from '../src/app.js';

test('informe lista cada cancelada bajo su sala con cabecera y total', () => {
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
  assert.ok(!run('informe', []).includes('lun 10:00-12:00'));
});

test('informe ordena salas alfabéticamente y reservas por día de la semana', () => {
  const list = [
    { room: 'Sur', day: 'vie', slot: '09:00-10:00', status: 'cancelled', reason: 'otro' },
    { room: 'Norte', day: 'jue', slot: '10:00-11:00', status: 'cancelled', reason: 'otro' },
    { room: 'Norte', day: 'lun', slot: '10:00-11:00', status: 'cancelled', reason: 'otro' },
  ];
  assert.deepEqual(
    cancelledReport(list).split('\n'),
    [
      'Norte: 2 canceladas',
      '  lun 10:00-11:00 — otro',
      '  jue 10:00-11:00 — otro',
      'Sur: 1 canceladas',
      '  vie 09:00-10:00 — otro',
      'Total: 3 canceladas',
    ],
  );
});

test('informe sin canceladas responde «sin canceladas»', () => {
  assert.equal(cancelledReport([{ room: 'Norte', day: 'lun', slot: '10:00-12:00', status: 'active' }]), 'sin canceladas');
});
