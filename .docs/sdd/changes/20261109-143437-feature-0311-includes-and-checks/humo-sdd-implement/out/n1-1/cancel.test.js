import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

// Los tests comparten el estado en memoria de src/app.js y corren en orden:
// los rechazos van antes de la cancelación válida, que es el GIVEN del listado.

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar']), 'sin reserva Sur mar');
});

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
});

test('cancelar sin --motivo lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con un motivo de la lista cancela y lo dice', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña la reserva cancelada con su motivo', () => {
  // GIVEN: la cancelación de Norte lun con «sala ocupada» del test anterior.
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
