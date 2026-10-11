import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo fuera de la lista responde la lista', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
});

test('cancelar sin motivo responde la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar una reserva activa con motivo', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']),
    'cancelada Norte lun (sala ocupada)',
  );
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('canceladas enseña el motivo de la reserva cancelada', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
