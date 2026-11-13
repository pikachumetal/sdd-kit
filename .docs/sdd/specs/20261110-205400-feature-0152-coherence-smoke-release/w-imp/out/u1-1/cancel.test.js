import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar sin motivo', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--por', 'Ana']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con motivo válido y sin --por', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'falta quién cancela: usa --por <nombre>');
});

async function freshRun() {
  const app = await import(`../src/app.js?fresh=${Math.random()}`);
  return app.run;
}

test('canceladas enseña sala, día, motivo y quién canceló', async () => {
  const fresh = await freshRun();
  fresh('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']);
  assert.equal(fresh('canceladas', []), 'Norte lun — sala ocupada — Ana');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro', '--por', 'Ana']), 'sin reserva Sur mar');
});

test('cancelar otro día no cancela la reserva del lunes', async () => {
  const fresh = await freshRun();
  assert.equal(fresh('cancelar', ['Norte', 'mar', '--motivo', 'otro', '--por', 'Ana']), 'sin reserva Norte mar');
  assert.equal(fresh('cancelar', ['Norte', 'lun', '--motivo', 'otro', '--por', 'Ana']), 'cancelada Norte lun (otro)');
});

test('cancelar con --por sin nombre pide quién cancela', () => {
  const missing = 'falta quién cancela: usa --por <nombre>';
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro', '--por']), missing);
  assert.equal(run('cancelar', ['Sur', 'mar', '--por', '--motivo', 'otro']), missing);
});
