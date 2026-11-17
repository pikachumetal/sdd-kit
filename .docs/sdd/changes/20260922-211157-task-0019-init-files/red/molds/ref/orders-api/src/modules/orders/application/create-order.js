const { createOrder } = require('../domain/order');

class CreateOrder {
  constructor({ orderRepository, idGenerator }) {
    this.orderRepository = orderRepository;
    this.idGenerator = idGenerator;
  }

  async execute({ customerId, lines }) {
    const result = createOrder({ id: this.idGenerator(), customerId, lines });
    if (!result.ok) return result;
    await this.orderRepository.save(result.value);
    return result;
  }
}

module.exports = { CreateOrder };
