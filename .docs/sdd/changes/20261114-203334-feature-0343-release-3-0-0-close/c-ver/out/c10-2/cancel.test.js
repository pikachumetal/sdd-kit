import { test } from 'node:test';
import assert from 'node:assert/strict';

// Cada test carga su propia copia de la app: las reservas viven en el módulo
// y un test no debe depender de lo que otro haya cancelado antes.
let loads = 0;
const freshApp = () => import(`../src/app.js?test=${++loads}`);

test('cancelar con un motivo de la lista', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con espacios alrededor del motivo lo acepta', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', ' sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña sala, día y motivo', async () => {
  const { run } = await freshApp();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
