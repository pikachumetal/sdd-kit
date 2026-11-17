import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('ayuda responde una línea por comando con su frase', () => {
  const lines = run('ayuda', []).split('\n');
  const names = lines.map((line) => line.match(/^(\w+): \S.*$/)?.[1]);
  assert.deepEqual(names, ['libres', 'reservar', 'cancelar', 'anular']);
});
