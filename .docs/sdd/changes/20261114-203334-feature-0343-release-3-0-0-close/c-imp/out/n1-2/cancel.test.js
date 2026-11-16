import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const MOTIVO_NO_VALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']), MOTIVO_NO_VALIDO);
});

test('cancelar sin --motivo lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVO_NO_VALIDO);
});

test('cancelar con un motivo de la lista cancela y lo dice', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']),
    'cancelada Norte lun (sala ocupada)',
  );
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('canceladas enseña la reserva cancelada con su motivo', async () => {
  const { run: runFresh } = await import('../src/app.js?canceladas');
  runFresh('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(runFresh('canceladas', []), 'Norte lun — sala ocupada');
});
