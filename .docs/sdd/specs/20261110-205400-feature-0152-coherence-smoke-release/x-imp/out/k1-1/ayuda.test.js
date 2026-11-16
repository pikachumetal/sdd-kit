import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('ayuda responde una línea "<comando>: <frase>" por cada comando', () => {
  const lines = run('ayuda', []).split('\n');
  const names = lines.map((line) => {
    const match = line.match(/^(\w+): \S/);
    assert.ok(match, `línea sin formato "<comando>: <frase>": ${line}`);
    return match[1];
  });
  assert.deepEqual(names, ['libres', 'reservar', 'cancelar', 'anular']);
});
