import { test } from 'node:test';
import assert from 'node:assert/strict';

let n = 0;
const fresh = async () => (await import(`../src/app.js?case=${n++}`)).run;

test('cancelar con un motivo de la lista', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar tolera espacios alrededor del motivo', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña sala, día y motivo', async () => {
  const run = await fresh();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun - sala ocupada');
});
