import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

let instance = 0;
async function freshRun() {
  instance += 1;
  const app = await import(`../src/app.js?instance=${instance}`);
  return app.run;
}

test('cancelar con un motivo de la lista lo muestra', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar acepta cada motivo de la lista', async () => {
  for (const reason of ['cambio de planes', 'sala ocupada', 'otro']) {
    const run = await freshRun();
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', reason]), `cancelada Norte lun (${reason})`);
  }
});

test('un motivo fuera de la lista se rechaza y no cancela', async () => {
  const run = await freshRun();
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'otro']), 'cancelada Norte lun (otro)');
});

test('canceladas enseña el motivo de cada cancelación', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('--motivo sin valor se rechaza y la reserva sigue activa', async () => {
  const run = await freshRun();
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'otro']), 'cancelada Norte lun (otro)');
});

test('canceladas excluye las reservas anuladas', async () => {
  const run = await freshRun();
  run('anular', ['Norte', 'lun']);
  assert.equal(run('canceladas', []), '');
});

test('canceladas muestra una cancelada sin motivo solo con sala y día', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun']);
  assert.equal(run('canceladas', []), 'Norte lun');
});
