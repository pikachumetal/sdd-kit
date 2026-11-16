import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

const fresh = (n) => import(`../src/app.js?fresh=${n}`);

test('canceladas enseña sala, día y motivo', async () => {
  const app = await fresh('listado');
  app.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(app.run('canceladas', []), 'Norte lun — sala ocupada');
});

test('cancelar con --por guarda quién cancela y canceladas lo enseña', async () => {
  const app = await fresh('por');
  assert.equal(app.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']), 'cancelada Norte lun (sala ocupada)');
  assert.equal(app.run('canceladas', []), 'Norte lun — sala ocupada — Ana');
});
