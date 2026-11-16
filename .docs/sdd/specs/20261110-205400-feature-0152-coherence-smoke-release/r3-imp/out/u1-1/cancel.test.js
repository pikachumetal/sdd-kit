import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('el listado de canceladas enseña sala, día y motivo', async () => {
  const app = await import('../src/app.js?listado'); // módulo propio: el estado no viene de otros tests
  app.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(app.run('canceladas', []), 'Norte lun — sala ocupada');
});

test('cancelar sin --motivo responde que el motivo no es válido', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con motivo válido una reserva que no existe lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});
