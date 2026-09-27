const { test } = require('node:test');
const assert = require('node:assert');
const { CreateOrder } = require('../src/modules/orders/application/create-order');
const { InMemoryOrderRepository } = require('../src/modules/orders/infrastructure/memory-order-repository');

test('un pedido sin líneas falla con ORDER_EMPTY', async () => {
  const useCase = new CreateOrder({ orderRepository: new InMemoryOrderRepository(), idGenerator: () => 'o-1' });
  const result = await useCase.execute({ customerId: 'c-1', lines: [] });
  assert.strictEqual(result.error.code, 'ORDER_EMPTY');
});
