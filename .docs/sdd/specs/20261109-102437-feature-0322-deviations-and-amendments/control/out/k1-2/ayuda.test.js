import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('la ayuda responde una línea "comando: frase" por comando', () => {
  const lines = run('ayuda', []).split('\n');
  for (const line of lines) assert.match(line, /^[a-z]+: \S.*$/);
});

test('la ayuda lista libres, reservar, cancelar y anular', () => {
  const names = run('ayuda', []).split('\n').map((line) => line.split(':')[0]);
  for (const command of ['libres', 'reservar', 'cancelar', 'anular']) {
    assert.ok(names.includes(command), `falta ${command}`);
  }
});
