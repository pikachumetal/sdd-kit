import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar ignora los espacios alrededor del motivo', async () => {
  const fresh = await import('../src/app.js?trim');
  assert.equal(fresh.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada ']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña sala, día y motivo', async () => {
  const fresh = await import('../src/app.js?listado');
  fresh.run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(fresh.run('canceladas', []), 'Norte lun — sala ocupada');
});
