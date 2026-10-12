import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { commands } from '../src/app.js';

test('el README documenta cada comando de la app', () => {
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  const documented = [...readme.matchAll(/^- `(\w+)/gm)].map((m) => m[1]);
  assert.deepEqual(documented, commands);
});
