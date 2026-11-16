import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

// Cada test nuevo carga su propia copia del módulo: el almacén es estado de módulo.
const fresh = (id) => import(`../src/app.js?${id}`);

test('cancelar otro día sin reserva lo dice y no toca la del lunes', async () => {
  const app = await fresh('cancelar-otro-dia');
  assert.equal(app.run('cancelar', ['Norte', 'mar']), 'sin reserva Norte mar');
  assert.equal(app.run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('anular otro día sin reserva lo dice y no toca la del lunes', async () => {
  const app = await fresh('anular-otro-dia');
  assert.equal(app.run('anular', ['Norte', 'mar']), 'sin reserva Norte mar');
  assert.equal(app.run('anular', ['Norte', 'lun']), 'anulada Norte lun');
});

test('cancelar una reserva activa', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'cancelada Norte lun');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});
