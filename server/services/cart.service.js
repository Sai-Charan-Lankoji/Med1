const Cart = require("../models/cart.model");
const crypto = require("crypto");
const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

class CartService {
  async createCart(data) {
    if (!data.designs || !Array.isArray(data.designs)) {
      throw new Error("Designs must be provided as an array.");
    }
    const basePrice = data.designs.length * 100;
    const totalPrice = basePrice * data.quantity;
    const id = generateEntityId("cart");
    const cartData = {
      id,
      ...data,
      price: basePrice,
      total_price: totalPrice,
    };

    return await Cart.create(cartData);
  }

  async getCartById(cartId) {
    const cart = await Cart.findOne({ where: {id: cartId}});
    if (!cart) throw new Error(`Cart with ID ${cartId} not found.`);
    return cart;
  }

  async updateCart(cartId, updates) {
    const cart = await this.getCartById(cartId);
    return await cart.update(updates);
  }

  async deleteCart(cartId) {
    const cart = await Cart.findOne({ where: {id: cartId}});
    await cart.destroy({force: true});
  }

  async retrieveByCustomerId(customerId) {
    return await Cart.findAll({ where: { customer_id: customerId } });
  }

  async clearCustomerCart(customerId) {
    const carts = await Cart.findAll({ where: { customer_id: customerId } });
    if (carts.length === 0)
      throw new Error(`No carts found for customer ${customerId}`);
    await Cart.destroy({ where: { customer_id: customerId } });
  }

  async updateCartQuantity(cartId, newQuantity) {
    const cart = await this.getCartById(cartId); // Fetch cart instance
    if (!cart) throw new Error(`Cart with ID ${cartId} not found.`);

    if (newQuantity <= 0) {
      throw new Error("Quantity must be greater than zero.");
    }

    // Update total price based on the new quantity
    const updatedTotalPrice = cart.price * newQuantity;

    return await cart.update({
      quantity: newQuantity,
      total_price: updatedTotalPrice,
    });
  }
}

module.exports = new CartService();
