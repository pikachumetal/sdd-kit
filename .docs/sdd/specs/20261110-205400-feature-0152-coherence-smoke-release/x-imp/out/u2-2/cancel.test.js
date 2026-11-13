import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con --por guarda quién cancela', async () => {
  const app = await import('../src/app.js?por');
  assert.equal(app.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']), 'cancelada Norte lun (sala ocupada)');
  assert.equal(app.bookings.find((b) => b.room === 'Norte' && b.day === 'lun').cancelledBy, 'Ana');
});

test('canceladas enseña motivo y quién canceló', async () => {
  const app = await import('../src/app.js?lista');
  app.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']);
  assert.equal(app.run('canceladas', []), 'Norte lun — sala ocupada — Ana');
});
