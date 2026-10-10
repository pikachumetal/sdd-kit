import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

// El estado vive en el módulo: los tests de este fichero van en orden.

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
});

test('cancelar sin motivo lo rechaza', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});

test('cancelar una reserva activa con motivo', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']),
    'cancelada Norte lun (sala ocupada)',
  );
});

test('canceladas enseña sala, día, motivo y quién canceló', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada — Ana');
});
