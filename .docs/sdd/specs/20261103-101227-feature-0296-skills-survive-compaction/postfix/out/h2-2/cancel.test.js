import { test } from 'node:test';
import assert from 'node:assert/strict';

let instance = 0;
// El estado vive en memoria: cada test pide su propio módulo para empezar con «Norte lun» activa.
async function freshRun() {
  const { run } = await import(`../src/app.js?instance=${instance++}`);
  return run;
}

const MOTIVO_NO_VALIDO = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con motivo de la lista lo enseña', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista lo rechaza', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), MOTIVO_NO_VALIDO);
});

test('cancelar sin --motivo lo rechaza igual', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Norte', 'lun']), MOTIVO_NO_VALIDO);
});

test('cancelar sin reserva lo dice', async () => {
  const run = await freshRun();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña el motivo de la reserva cancelada', async () => {
  const run = await freshRun();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
