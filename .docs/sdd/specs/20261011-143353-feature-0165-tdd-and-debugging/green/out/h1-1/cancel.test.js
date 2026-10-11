import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

// El estado vive en el módulo: cada test del motivo usa su propia instancia.
const freshApp = (id) => import(`../src/app.js?${id}`);

test('cancelar con un motivo de la lista lo incluye en la respuesta', async () => {
  const { run } = await freshApp('motivo-valido');
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista lo rechaza y no cancela', async () => {
  const { run } = await freshApp('motivo-invalido');
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'otro']), 'cancelada Norte lun (otro)');
});

test('canceladas enseña el motivo de cada reserva cancelada', async () => {
  const { run } = await freshApp('listado');
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('canceladas no inventa un motivo para la cancelada sin --motivo', async () => {
  const { run } = await freshApp('listado-sin-motivo');
  run('cancelar', ['Norte', 'lun']);
  assert.equal(run('canceladas', []), 'Norte lun — sin motivo');
});

test('--motivo sin valor se rechaza y no cancela', async () => {
  const { run } = await freshApp('motivo-sin-valor');
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  assert.equal(run('canceladas', []), '');
});
