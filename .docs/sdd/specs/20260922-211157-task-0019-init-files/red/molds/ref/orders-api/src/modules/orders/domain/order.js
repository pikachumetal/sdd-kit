const { ok, fail } = require('../../../shared/result');

function createOrder({ id, customerId, lines }) {
  if (!lines || lines.length === 0) return fail('ORDER_EMPTY', 'Un pedido necesita al menos una línea');
  const total = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  return ok(Object.freeze({ id, customerId, lines, total, status: 'open' }));
}

module.exports = { createOrder };
