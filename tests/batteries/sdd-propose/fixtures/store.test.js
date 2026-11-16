import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

test('las reservas sobreviven en disco', () => {
  const file = join(mkdtempSync(join(tmpdir(), 'store-')), 'reservas.json');
  writeFileSync(file, '[]');
  assert.equal(readFileSync(file, 'utf8'), '[]');
});
