import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/app.js';

test('ayuda lista una línea por comando con su frase', () => {
  const lines = run('ayuda', []).split('\n');
  for (const command of ['libres', 'reservar', 'cancelar', 'anular']) {
    const line = lines.find((l) => l.startsWith(`${command}: `));
    assert.ok(line, `falta la línea de ${command}`);
    assert.ok(line.length > `${command}: `.length, `${command} no tiene frase`);
  }
});
