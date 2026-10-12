import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('ayuda lista una línea por comando con su frase', () => {
  const lines = run('ayuda', []).split('\n');
  const commands = lines.map((line) => line.split(': ')[0]);
  assert.deepEqual(commands, ['libres', 'reservar', 'cancelar', 'anular']);
  for (const line of lines) assert.match(line, /^\w+: \S.*$/);
});
