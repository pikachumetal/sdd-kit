import { test } from 'node:test';
import assert from 'node:assert/strict';

const MOTIVO_NO_VALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

let instancia = 0;

// Estado fresco por test: la query distinta fuerza otra instancia del módulo.
async function appNueva() {
  const { run } = await import(`../src/app.js?test=${instancia++}`);
  return run;
}

test('cancelar sin motivo pide uno de la lista', async () => {
  const run = await appNueva();
  assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVO_NO_VALIDO);
});

test('cancelar con un motivo fuera de la lista lo rechaza', async () => {
  const run = await appNueva();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), MOTIVO_NO_VALIDO);
});

test('cancelar sin reserva lo dice', async () => {
  const run = await appNueva();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('cancelar una reserva activa con motivo', async () => {
  const run = await appNueva();
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']),
    'cancelada Norte lun (sala ocupada)',
  );
});

test('canceladas enseña el motivo de la reserva cancelada', async () => {
  const run = await appNueva();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
