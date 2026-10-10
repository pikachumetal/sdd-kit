import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

// Cada test usa un módulo nuevo: las reservas viven en memoria y solo hay una.
const fresh = async (n) => (await import(`../src/app.js?${n}`)).run;

test('cancelar con --por responde igual que sin él', async () => {
  const run = await fresh('por');
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña sala, día, motivo y quién canceló', async () => {
  const run = await fresh('listado');
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada — Ana');
});

test('canceladas dice «sin indicar» si se canceló sin --por', async () => {
  const run = await fresh('sin-por');
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada — sin indicar');
});

test('cancelar sin reserva lo dice, con un motivo válido', async () => {
  const run = await fresh('sin-reserva');
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});
