import { test } from 'node:test';
import assert from 'node:assert/strict';

const MOTIVO_NO_VALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

let instancias = 0;

async function nuevaApp() {
  instancias += 1;
  const { run } = await import(`../src/app.js?instancia=${instancias}`);
  return run;
}

test('cancelar con un motivo fuera de la lista lo rechaza', async () => {
  const run = await nuevaApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), MOTIVO_NO_VALIDO);
});

test('cancelar sin --motivo lo rechaza', async () => {
  const run = await nuevaApp();
  assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVO_NO_VALIDO);
});

test('cancelar una reserva activa con motivo', async () => {
  const run = await nuevaApp();
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']),
    'cancelada Norte lun (sala ocupada)',
  );
});

test('cancelar sin reserva lo dice', async () => {
  const run = await nuevaApp();
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('canceladas enseña el motivo de cada cancelación', async () => {
  const run = await nuevaApp();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
