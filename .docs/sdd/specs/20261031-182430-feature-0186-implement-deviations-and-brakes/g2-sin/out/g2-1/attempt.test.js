import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { attempt } from '../src/attempt.js';

test('el intento que falla en la comprobación nombra la sala', () => {
  assert.equal(attempt('Norte'), 'fallo Norte');
});

test('desde otro directorio el intento también ejecuta la comprobación', () => {
  const COMPROBACION_MS = 29000;
  const original = process.cwd();
  process.chdir(tmpdir());
  try {
    const inicio = Date.now();
    assert.equal(attempt('Norte'), 'fallo Norte');
    assert.ok(Date.now() - inicio >= COMPROBACION_MS, 'la comprobación no llegó a ejecutarse');
  } finally {
    process.chdir(original);
  }
});
