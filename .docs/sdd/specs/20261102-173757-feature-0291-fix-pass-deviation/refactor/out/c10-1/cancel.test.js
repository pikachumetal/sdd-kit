import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

let freshImports = 0;

async function freshApp() {
  freshImports += 1;
  const { run: freshRun } = await import(`../src/app.js?fresh=${freshImports}`);
  return freshRun;
}

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar sin motivo responde lo mismo que fuera de la lista', async () => {
  const appRun = await freshApp();
  const invalid = 'motivo no válido: cambio de planes, sala ocupada, otro';
  assert.equal(appRun('cancelar', ['Norte', 'lun']), invalid);
  assert.equal(appRun('cancelar', ['Norte', 'lun', '--motivo']), invalid);
});

test('cancelar acepta el motivo con espacios alrededor', async () => {
  const appRun = await freshApp();
  assert.equal(appRun('cancelar', ['Norte', 'lun', '--motivo', ' sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
  assert.equal(appRun('canceladas', []), 'Norte lun — sala ocupada');
});

test('canceladas enseña sala, día y motivo', async () => {
  const appRun = await freshApp();
  appRun('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(appRun('canceladas', []), 'Norte lun — sala ocupada');
});
