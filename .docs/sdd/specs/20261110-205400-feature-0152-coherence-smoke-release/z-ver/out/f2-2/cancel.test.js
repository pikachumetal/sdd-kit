import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const motivoInvalido = 'motivo no válido: cambio de planes, sala ocupada, otro';
let instancias = 0;
const appNueva = async () => (await import(`../src/app.js?instancia=${++instancias}`)).run;

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), motivoInvalido);
});

test('cancelar sin --motivo responde lo mismo', async () => {
  const app = await appNueva();
  assert.equal(app('cancelar', ['Norte', 'lun']), motivoInvalido);
  assert.equal(app('canceladas', []), '');
});

test('cancelar sin reserva con un motivo válido lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('canceladas enseña sala, día y motivo', async () => {
  const app = await appNueva();
  app('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']);
  assert.equal(app('canceladas', []), 'Norte lun — sala ocupada');
});
