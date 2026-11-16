import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

const invalidReason = 'motivo no válido: cambio de planes, sala ocupada, otro';

async function isolatedRun() {
  const app = await import(`../src/app.js?isolated=${Math.random()}`);
  return app.run;
}

test('canceladas enseña sala, día y motivo', async () => {
  const run = await isolatedRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('cancelar sin --motivo responde motivo no válido y no cancela', async () => {
  const run = await isolatedRun();
  assert.equal(run('cancelar', ['Norte', 'lun']), invalidReason);
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'otro']), 'cancelada Norte lun (otro)');
});

test('cancelar una sala sin reserva, con motivo válido, lo dice', async () => {
  const run = await isolatedRun();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});
