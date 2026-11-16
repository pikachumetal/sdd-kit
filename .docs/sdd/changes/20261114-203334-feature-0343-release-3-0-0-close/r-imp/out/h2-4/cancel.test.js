import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

const INVALID_REASON = 'motivo no válido: cambio de planes, sala ocupada, otro';

test('cancelar con un motivo fuera de la lista lo rechaza', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'porque sí']), INVALID_REASON);
});

test('cancelar sin --motivo lo rechaza igual', () => {
  assert.equal(run('cancelar', ['Norte', 'lun']), INVALID_REASON);
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

// Depende del test anterior: deja cancelada la reserva de Norte del lunes con «sala ocupada».
test('canceladas enseña el motivo de la reserva cancelada', () => {
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada');
});
