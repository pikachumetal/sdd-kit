import { test } from 'node:test';
import assert from 'node:assert/strict';

let loads = 0;

// El estado de las reservas vive en el módulo: cada test carga el suyo para no depender del orden.
async function freshRun() {
  loads += 1;
  const { run } = await import(`../src/app.js?test=${loads}`);
  return run;
}

test('cancelar con un motivo de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
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

test('cancelar acepta el motivo con espacios alrededor y guarda el de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
