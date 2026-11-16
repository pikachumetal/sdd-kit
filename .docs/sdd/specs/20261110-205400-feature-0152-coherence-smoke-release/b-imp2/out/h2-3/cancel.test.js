import { test } from 'node:test';
import assert from 'node:assert/strict';

let n = 0;
// Instancia fresca del módulo: cada test parte del estado inicial.
const fresh = async () => (await import(`../src/app.js?t=${n++}`)).run;

const INVALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con motivo de la lista', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), INVALIDO);
});

test('cancelar sin --motivo', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALIDO);
});

test('un motivo no válido no cancela la reserva', async () => {
  const run = await fresh();
  run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']);
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'otro']), 'cancelada Norte lun (otro)');
});

test('cancelar sin reserva lo dice', async () => {
  const run = await fresh();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña el motivo', async () => {
  const run = await fresh();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
