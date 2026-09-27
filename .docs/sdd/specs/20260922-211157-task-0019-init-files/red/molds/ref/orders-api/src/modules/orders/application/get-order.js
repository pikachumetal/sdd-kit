const { ok, fail } = require('../../../shared/result');

class GetOrder {
  constructor({ orderRepository }) {
    this.orderRepository = orderRepository;
  }

  async execute({ orderId }) {
    const order = await this.orderRepository.findById(orderId);
    return order ? ok(order) : fail('ORDER_NOT_FOUND', `No existe el pedido ${orderId}`);
  }
}

module.exports = { GetOrder };
