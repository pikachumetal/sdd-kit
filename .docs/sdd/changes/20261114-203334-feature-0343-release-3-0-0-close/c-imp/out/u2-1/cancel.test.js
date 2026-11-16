import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('canceladas enseña sala, día y motivo si se canceló sin --por', async () => {
  const app = await import('../src/app.js?sin-por');
  app.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(app.run('canceladas', []), 'Norte lun — sala ocupada');
});

test('canceladas enseña quién canceló con --por', async () => {
  const app = await import('../src/app.js?con-por');
  assert.equal(app.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']), 'cancelada Norte lun (sala ocupada)');
  assert.equal(app.run('canceladas', []), 'Norte lun — sala ocupada — Ana');
});

test('cancelar sin --motivo', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar una reserva que no existe con un motivo válido', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});
