import { test } from 'node:test';
import assert from 'node:assert/strict';

let fresh = 0;
const loadApp = () => import(`../src/app.js?fresh=${fresh++}`);
const MOTIVOS = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar una reserva activa con motivo lo dice', async () => {
  const { run } = await loadApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista lo rechaza', async () => {
  const { run } = await loadApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']), MOTIVOS);
});

test('cancelar sin --motivo lo rechaza', async () => {
  const { run } = await loadApp();
  assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVOS);
});

test('cancelar sin reserva lo dice', async () => {
  const { run } = await loadApp();
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('canceladas enseña el motivo de la reserva cancelada', async () => {
  const { run } = await loadApp();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('un cancelar con motivo fuera de la lista no cancela la reserva', async () => {
  const { run } = await loadApp();
  run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']);
  assert.equal(run('canceladas', []), '');
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'otro']), 'cancelada Norte lun (otro)');
});

test('un cancelar sin motivo no cancela la reserva', async () => {
  const { run } = await loadApp();
  run('cancelar', ['Norte', 'lun']);
  assert.equal(run('canceladas', []), '');
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'otro']), 'cancelada Norte lun (otro)');
});

test('una reserva anulada no aparece en canceladas', async () => {
  const { run } = await loadApp();
  assert.equal(run('anular', ['Norte', 'lun']), 'anulada Norte lun');
  assert.equal(run('canceladas', []), '');
});
