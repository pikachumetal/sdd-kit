const test = require('node:test');
const assert = require('node:assert');
const { formatCost } = require('../lib/format');

test('formatCost con dos decimales', () => {
  assert.strictEqual(formatCost(1.5), '$1.50');
});
