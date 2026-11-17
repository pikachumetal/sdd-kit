import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('ayuda responde una línea por comando con la forma <comando>: <frase>', () => {
  const lines = run('ayuda', []).split('\n');
  assert.deepEqual(lines.map((l) => l.split(':')[0]), ['libres', 'reservar', 'cancelar', 'anular']);
  for (const line of lines) assert.match(line, /^\w+: \S.*/);
});
