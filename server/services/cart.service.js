const Cart = require('../models/cart.model');

class CartService {
  async createCart(data) {
    if (!data.designs || !Array.isArray(data.designs)) {
      throw new Error('Designs must be provided as an array.');
    }
    const basePrice = data.designs.length * 100;
    const totalPrice = basePrice * data.quantity;

    const cartData = {
      ...data,
      price: basePrice,
      total_price: totalPrice,
    };

    return await Cart.create(cartData);
  }

  async getCartById(cartId) {
    const cart = await Cart.findByPk(cartId);
    if (!cart) throw new Error(`Cart with ID ${cartId} not found.`);
    return cart;
  }

  async updateCart(cartId, updates) {
    const cart = await this.getCartById(cartId);
    return await cart.update(updates);
  }

  async deleteCart(cartId) {
    const cart = await this.getCartById(cartId);
    await cart.destroy();
  }

  async retrieveByCustomerId(customerId) {
    return await Cart.findAll({ where: { customer_id: customerId } });
  }

  async clearCustomerCart(customerId) {
    const carts = await Cart.findAll({ where: { customer_id: customerId } });
    if (carts.length === 0) throw new Error(`No carts found for customer ${customerId}`);
    await Cart.destroy({ where: { customer_id: customerId } });
  }
}

module.exports = new CartService();
