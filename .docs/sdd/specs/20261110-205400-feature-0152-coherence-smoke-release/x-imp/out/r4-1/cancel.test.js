import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar sin motivo responde lo mismo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar una reserva inexistente', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña sala, día y motivo', async () => {
  // Copia fresca del módulo: no depende del estado que dejen otros tests.
  const fresh = await import('../src/app.js?fresh=' + Date.now());
  fresh.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(fresh.run('canceladas', []), 'Norte lun — sala ocupada');
});
