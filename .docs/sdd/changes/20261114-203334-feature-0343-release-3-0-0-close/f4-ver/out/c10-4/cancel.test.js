import { test } from 'node:test';
import assert from 'node:assert/strict';

let instance = 0;
const fresh = async () => (await import(`../src/app.js?instance=${instance++}`)).run;

test('cancelar con un motivo de la lista', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar sin --motivo', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar acepta el motivo con espacios alrededor', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña sala, día y motivo', async () => {
  const run = await fresh();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
