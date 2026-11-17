import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const MOTIVO_NO_VALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('un motivo fuera de la lista no cancela', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), MOTIVO_NO_VALIDO);
});

test('cancelar sin --motivo responde motivo no válido', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVO_NO_VALIDO);
});

test('cancelar una reserva activa con motivo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña el motivo de cada cancelación', async () => {
  const { run: runConEstadoPropio } = await import('../src/app.js?canceladas');
  runConEstadoPropio('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(runConEstadoPropio('canceladas', []), 'Norte lun — sala ocupada');
});
