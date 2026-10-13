import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

let freshImports = 0;
const freshRun = async () => (await import(`../src/app.js?fresh=${freshImports++}`)).run;

test('cancelar con un motivo de la lista lo incluye en la respuesta', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista lo rechaza', async () => {
  const run = await freshRun();
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
});

test('canceladas enseña el motivo de cada reserva cancelada', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('cancelar con --motivo sin valor lo rechaza y no cancela', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), 'motivo no válido: cambio de planes, sala ocupada, otro');
  assert.equal(run('canceladas', []), '');
});
