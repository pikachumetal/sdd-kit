import { test } from 'node:test';
import assert from 'node:assert/strict';

let fresh = 0;
const load = () => import(`../src/app.js?test=${fresh++}`);

test('cancelar con un motivo de la lista', async () => {
  const { run } = await load();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const { run } = await load();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar acepta el motivo con espacios alrededor', async () => {
  const { run } = await load();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña sala, día y motivo', async () => {
  const { run } = await load();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun - sala ocupada');
});
