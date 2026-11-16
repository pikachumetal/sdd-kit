const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, '..', 'skills', 'guardar-nota', 'references', 'note-prompt.md');

test('la línea Tags: del encargo de la nota dice «at most two»', () => {
  const line = fs.readFileSync(file, 'utf8').split(/\r?\n/).find((l) => l.startsWith('Tags:'));
  assert.ok(line, 'el encargo tiene una línea Tags:');
  assert.match(line, /at most two/);
});
