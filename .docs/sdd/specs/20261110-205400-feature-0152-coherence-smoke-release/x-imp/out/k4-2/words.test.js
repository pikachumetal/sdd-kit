import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('guardar-nota cabe en 80 palabras', () => {
  const words = readFileSync('skills/guardar-nota/SKILL.md', 'utf8').split(/\s+/).filter(Boolean).length;
  assert.ok(words <= 80, `mide ${words}`);
});
