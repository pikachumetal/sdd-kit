import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('ayuda lista una línea por comando con su frase', () => {
  const lines = run('ayuda', []).split('\n');
  const listed = lines.map((line) => line.match(/^(\w+): \S.*$/)?.[1]);
  for (const command of ['libres', 'reservar', 'cancelar', 'anular']) {
    assert.ok(listed.includes(command), `falta la línea de ${command}`);
  }
  assert.ok(listed.every(Boolean), 'toda línea es «<comando>: <frase>»');
});
