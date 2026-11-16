import { test } from 'node:test';
import assert from 'node:assert/strict';

let loads = 0;
const freshApp = () => import(`../src/app.js?fresh=${++loads}`);

test('cancelar con un motivo de la lista lo confirma con el motivo', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

for (const motivo of ['cambio de planes', 'otro']) {
  test(`cancelar acepta el motivo «${motivo}»`, async () => {
    const { run } = await freshApp();
    assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', motivo]), `cancelada Norte lun (${motivo})`);
  });
}

test('un motivo fuera de la lista se rechaza', async () => {
  const { run } = await freshApp();
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
});

test('sin --motivo responde lo mismo que un motivo fuera de la lista', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('--motivo sin valor se rechaza', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('un motivo rechazado no cancela la reserva', async () => {
  const { run } = await freshApp();
  run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']);
  assert.equal(run('libres', ['10:00-12:00']), 'Sur');
});

test('cancelar sin reserva lo dice', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('cancelar sin reserva lo dice también con motivo', async () => {
  const { run } = await freshApp();
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña la reserva cancelada con su motivo', async () => {
  const { run } = await freshApp();
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('canceladas no enseña las reservas anuladas', async () => {
  const { run } = await freshApp();
  run('anular', ['Norte', 'lun']);
  assert.ok(!run('canceladas', []).includes('Norte'));
});
