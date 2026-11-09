import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('cancelar con un motivo de la lista', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']), 'cancelada Norte lun (sala ocupada)');
});

test('cancelar con un motivo fuera de la lista', () => {
  assert.equal(run('cancelar', ['Sur', 'mar', '--motivo', 'me aburro', '--por', 'Ana']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar sin motivo', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--por', 'Ana']), 'motivo no válido: cambio de planes, sala ocupada, otro');
});

test('cancelar sin --por', () => {
  assert.equal(run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']), 'falta quién cancela (--por <nombre>)');
});

test('canceladas enseña el motivo y quién canceló', () => {
  run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada', '--por', 'Ana']);
  assert.equal(run('canceladas', []), 'Norte lun — sala ocupada — Ana');
});
