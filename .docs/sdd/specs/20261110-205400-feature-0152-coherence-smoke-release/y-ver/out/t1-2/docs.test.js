import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readme = readFileSync('README.md', 'utf8');

test('el README nombra cancelar con motivo', () => assert.match(readme, /cancelar <sala> <día> --motivo/));
test('el README nombra canceladas', () => assert.match(readme, /canceladas/));
