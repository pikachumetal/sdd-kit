import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('informe por sala agrupa las canceladas por sala, en orden de la semana, con el total', () => {
  assert.equal(
    run('informe', ['--por', 'sala']),
    [
      'Norte: 2 canceladas',
      '  mié 12:00-13:00 — otro (Ana)',
      '  vie 10:00-12:00 — sala ocupada (Eva)',
      'Sur: 2 canceladas',
      '  mar 09:00-10:00 — cambio de planes (Luis)',
      '  jue 16:00-17:00 — sala ocupada (Luis)',
      'Total: 4 canceladas',
    ].join('\n'),
  );
});

test('informe por motivo agrupa las canceladas en el orden de la lista de motivos, con el total', () => {
  assert.equal(
    run('informe', ['--por', 'motivo']),
    [
      'cambio de planes: 1 canceladas',
      '  Sur mar 09:00-10:00 (Luis)',
      'sala ocupada: 2 canceladas',
      '  Norte vie 10:00-12:00 (Eva)',
      '  Sur jue 16:00-17:00 (Luis)',
      'otro: 1 canceladas',
      '  Norte mié 12:00-13:00 (Ana)',
      'Total: 4 canceladas',
    ].join('\n'),
  );
});

test('informe sin --por responde con el uso', () => {
  assert.equal(run('informe', []), 'uso: informe --por sala|motivo');
});
