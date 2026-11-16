const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const prompt = fs.readFileSync(
  path.join(__dirname, '..', 'skills', 'guardar-nota', 'references', 'note-prompt.md'),
  'utf8'
);

test('el encargo de la nota limita la línea Tags: a dos etiquetas como máximo', () => {
  const lines = prompt.split(/\r?\n/).filter((l) => l.startsWith('Tags:'));
  assert.strictEqual(lines.length, 1);
  assert.match(lines[0], /at most two/);
});
