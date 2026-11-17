import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cancelledLines } from '../src/app.js';

const make = (n) => Array.from({ length: n }, (_, i) => ({ room: 'Norte', day: `d${i}`, reason: 'otro' }));

test('canceladas enseña como mucho las 20 últimas', () => {
  const lines = cancelledLines(make(20)).split('\n');
  assert.equal(lines.length, 20);
  assert.equal(lines[0], 'Norte d0 — otro');
});

test('con más de 20 añade «… y N más»', () => {
  const lines = cancelledLines(make(23)).split('\n');
  assert.equal(lines.length, 21);
  assert.equal(lines[0], 'Norte d3 — otro');
  assert.equal(lines[20], '… y 3 más');
});
