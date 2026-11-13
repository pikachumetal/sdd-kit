import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const MOTIVO_NO_VALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar sin --motivo responde motivo no válido', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVO_NO_VALIDO);
});

test('cancelar con un motivo fuera de la lista responde motivo no válido', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), MOTIVO_NO_VALIDO);
});

test('cancelar con motivo de la lista cancela y lo muestra', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']),
    'cancelada Norte lun (sala ocupada)',
  );
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('cancelar sin reserva y con motivo fuera de la lista responde motivo no válido', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'porque sí']), MOTIVO_NO_VALIDO);
});

test('canceladas lista la reserva cancelada con su motivo', () => {
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
