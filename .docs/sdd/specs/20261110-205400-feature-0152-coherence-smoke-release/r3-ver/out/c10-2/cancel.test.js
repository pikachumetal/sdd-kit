import { test } from 'node:test';
import assert from 'node:assert/strict';

let instance = 0;
// Cada test importa su propia instancia de la app: las reservas viven en memoria
// y un test no depende de que otro haya corrido antes.
async function freshRun() {
  instance += 1;
  const { run } = await import(`../src/app.js?instance=${instance}`);
  return run;
}

test('cancelar con un motivo de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo de la lista con espacios alrededor', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('canceladas enseña sala, día y motivo', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('canceladas no depende del orden de los tests', async () => {
  const run = await freshRun();
  assert.equal(run('canceladas', []), '');
});
