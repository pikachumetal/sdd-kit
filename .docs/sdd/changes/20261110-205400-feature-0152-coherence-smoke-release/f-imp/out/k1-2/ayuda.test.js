import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('la ayuda lista una línea por comando con su frase', () => {
  const lines = run('ayuda', []).split('\n');
  const names = lines.map((line) => line.split(': ')[0]);
  for (const line of lines) assert.match(line, /^\w+: .+$/);
  for (const name of ['libres', 'reservar', 'cancelar', 'anular']) assert.ok(names.includes(name), name);
});
