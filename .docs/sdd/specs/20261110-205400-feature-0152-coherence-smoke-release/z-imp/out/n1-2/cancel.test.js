import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const motivoNoValido = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']), motivoNoValido);
});

test('cancelar sin --motivo lo rechaza igual', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), motivoNoValido);
});

test('cancelar con un motivo de la lista lo enseña en la respuesta', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña la reserva cancelada con su motivo', () => {
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
