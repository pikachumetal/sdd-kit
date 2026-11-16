import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar sin --motivo responde con la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('canceladas enseña el motivo de la reserva cancelada', async () => {
  const fresh = await import('../src/app.js?canceladas');
  fresh.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(fresh.run('canceladas', []), 'Norte lun — sala ocupada');
});
