import { test } from 'node:test';
import assert from 'node:assert/strict';

let imports = 0;
// Cada test importa su propia copia de la app: las reservas viven en memoria.
const freshRun = async () => (await import(`../src/app.js?test=${++imports}`)).run;

const motivoNoValido = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con un motivo de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con espacios alrededor del motivo', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), motivoNoValido);
});

test('cancelar sin --motivo', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun']), motivoNoValido);
});

test('cancelar con --motivo sin valor', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), motivoNoValido);
});

test('canceladas enseña sala, día y motivo', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
