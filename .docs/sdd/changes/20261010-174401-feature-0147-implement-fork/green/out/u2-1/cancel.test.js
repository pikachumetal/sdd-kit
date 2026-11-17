import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run, bookings } from '../src/app.js';

function reserve(room, day, slot = '16:00-18:00') {
  bookings.push({ room, day, slot, status: 'active' });
}

test('libres no cambia por cancelar: la franja de las 14:00 sigue libre en las dos salas', () => {
  assert.equal(run('libres', ['14:00-16:00']), 'Norte, Sur');
});

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar sin reserva lo dice', () => {
  assert.equal(run('cancelar', ['Sur', 'mie', '--motivo', 'otro']), 'sin reserva Sur mie');
});

test('cancelar con --por responde igual y canceladas enseña quién canceló', () => {
  reserve('Sur', 'jue');
  assert.equal(run('cancelar', ['Sur', 'jue', '--motivo', 'sala ocupada', '--por', 'Ana']), 'cancelada Sur jue (sala ocupada)');
  assert.ok(run('canceladas', []).split('\n').includes('Sur jue — sala ocupada — Ana'));
});

test('canceladas dice «sin indicar» si se canceló sin --por', () => {
  reserve('Norte', 'vie');
  run('cancelar', ['Norte', 'vie', '--motivo', 'otro']);
  assert.ok(run('canceladas', []).split('\n').includes('Norte vie — otro — sin indicar'));
});
