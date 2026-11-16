import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const MOTIVO_NO_VALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

// `bookings` es estado del módulo: quien cancela con éxito usa una instancia fresca.
const freshApp = (id) => import(`../src/app.js?${id}`);

test('cancelar con un motivo de la lista', async () => {
  const app = await freshApp('cancelar-con-motivo');
  assert.equal(app.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), MOTIVO_NO_VALIDO);
});

test('cancelar sin motivo lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVO_NO_VALIDO);
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña el motivo de la reserva cancelada', async () => {
  const app = await freshApp('canceladas-con-motivo');
  app.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(app.run('canceladas', []), 'Norte lun — sala ocupada');
});
