import { test } from 'node:test';
import assert from 'node:assert/strict';

let instance = 0;
// Cada test importa su propia copia del módulo: no comparten reservas ni dependen del orden.
const freshApp = () => import(`../src/app.js?test=${++instance}`);

test('cancelar con un motivo de la lista', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar ignora los espacios alrededor del motivo', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar sin --motivo responde motivo no válido', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('canceladas enseña sala, día y motivo con guion normal', async () => {
  const { run } = await freshApp();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun - sala ocupada');
});
