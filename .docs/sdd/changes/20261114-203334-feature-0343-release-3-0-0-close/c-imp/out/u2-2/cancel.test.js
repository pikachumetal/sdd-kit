import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con --por responde igual que sin él', async () => {
  const fresh = await import('../src/app.js?por');
  assert.equal(
    fresh.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']),
    'cancelada Norte lun (sala ocupada)',
  );
});

test('canceladas enseña sala, día, motivo y quién canceló', async () => {
  const fresh = await import('../src/app.js?listado');
  fresh.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']);
  assert.equal(fresh.run('canceladas', []), 'Norte lun — sala ocupada — Ana');
});

test('canceladas lista sin nombre la cancelada sin --por', async () => {
  const fresh = await import('../src/app.js?sinpor');
  fresh.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(fresh.run('canceladas', []), 'Norte lun — sala ocupada');
});

test('cancelar sin --motivo responde motivo no válido', async () => {
  const fresh = await import('../src/app.js?sinmotivo');
  assert.equal(fresh.run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con motivo válido sobre una sala sin reserva lo dice', async () => {
  const fresh = await import('../src/app.js?sinreserva');
  assert.equal(fresh.run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});
