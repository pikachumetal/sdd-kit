import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('ayuda lista una línea por comando con su frase', () => {
  const lines = run('ayuda', []).split('\n');
  const names = lines.map((line) => line.split(': ')[0]);
  assert.deepEqual(names, ['libres', 'reservar', 'cancelar', 'anular']);
  assert.ok(lines.every((line) => /^\w+: \S/.test(line)));
});
