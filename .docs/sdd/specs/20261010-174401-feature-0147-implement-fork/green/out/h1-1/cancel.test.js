import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

let instances = 0;
// Cada test nuevo parte de la reserva de Norte del lunes sin cancelar.
const freshApp = () => import(`../src/app.js?instancia=${++instances}`);

test('cancelar con un motivo de la lista lo muestra', async () => {
  const { run } = await freshApp();
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']),
    'cancelada Norte lun (sala ocupada)',
  );
});

test('un motivo fuera de la lista se rechaza y no cancela', async () => {
  const { run } = await freshApp();
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'otro']),
    'cancelada Norte lun (otro)',
  );
});

test('canceladas enseña sala, día y motivo', async () => {
  const { run } = await freshApp();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
