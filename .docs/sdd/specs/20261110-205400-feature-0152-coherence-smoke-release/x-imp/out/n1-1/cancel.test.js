import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

// Los tests comparten el estado del módulo: los rechazos van antes de la cancelación válida.

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(
    run('cancelar', ['Norte', 'lun', '--motivo', 'me aburro']),
    'motivo no válido: cambio de planes, sala ocupada, otro',
  );
});

test('cancelar sin --motivo lo rechaza igual', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar con un motivo de la lista cancela y lo dice', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('canceladas enseña la reserva cancelada con su motivo', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'otro']), 'sin reserva Sur mar');
});
