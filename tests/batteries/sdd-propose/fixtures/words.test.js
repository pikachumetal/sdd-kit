import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

const caps = { 'docs/guia.md': 60 };

for (const [file, cap] of Object.entries(caps)) {
  test(`${file} cabe en su tope de ${cap} palabras`, () => {
    const words = readFileSync(file, 'utf8').split(/\s+/).filter(Boolean).length;
    assert.ok(words <= cap, `${file} mide ${words} y el tope es ${cap}`);
  });
}
