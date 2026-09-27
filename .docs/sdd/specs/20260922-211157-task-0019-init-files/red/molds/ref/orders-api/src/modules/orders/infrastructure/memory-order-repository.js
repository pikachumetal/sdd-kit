class InMemoryOrderRepository {
  constructor() {
    this.orders = new Map();
  }

  async save(order) {
    this.orders.set(order.id, order);
  }

  async findById(id) {
    return this.orders.get(id) ?? null;
  }
}

module.exports = { InMemoryOrderRepository };
