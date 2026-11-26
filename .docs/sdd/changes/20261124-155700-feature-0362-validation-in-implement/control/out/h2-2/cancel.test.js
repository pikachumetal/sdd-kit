import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const REASON_ERROR = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), REASON_ERROR);
});

test('cancelar sin --motivo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), REASON_ERROR);
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

// Depende del primer test de este fichero, que deja cancelada Norte lun con «sala ocupada».
test('canceladas enseña el motivo', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
