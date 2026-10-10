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
const freshApp = () => import(`../src/app.js?instancia=${instance++}`);

test('cancelar con un motivo de la lista lo responde entre paréntesis', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista lo rechaza y no cancela', async () => {
  const { run } = await freshApp();
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'otro']), 'cancelada Norte lun (otro)');
});

test('canceladas enseña sala, día y motivo de la reserva cancelada', async () => {
  const { run } = await freshApp();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('canceladas no lista las reservas anuladas', async () => {
  const { run } = await freshApp();
  run('anular', ['Norte', 'lun']);
  assert.equal(run('canceladas', []), '');
});
