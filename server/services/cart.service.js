const Cart = require("../models/cart.model");
const StandardProduct = require("../models/standardProduct.model");
const crypto = require("crypto");

class CartService {
  /**
   * ✅ Create a cart item (Handles both Standard & Designable Products)
   */
  async createCart(data) {
    if (!data.customer_id || !data.product_type) {
      throw new Error(
        "Missing required fields: customer_id, product_id, product_type"
      );
    }

    // Check if the product already exists in the cart
    if (data.product_type === "Standard") {
      const existingCartItem = await Cart.findOne({
        where: {
          customer_id: data.customer_id,
          product_id: data.product_id,
          product_type: data.product_type,
        },
      });

      if (existingCartItem) {
        // ✅ If product exists, update quantity instead of creating duplicate entry
        const newQuantity = existingCartItem.quantity + (data.quantity || 1);
        const updatedTotalPrice = existingCartItem.price * newQuantity;

        await existingCartItem.update({
          quantity: newQuantity,
          total_price: updatedTotalPrice,
        });

        return existingCartItem;
      }
    }
    // ✅ Default values
    let quantity = data.quantity || 1;
    let price = data.price || 0;
    let total_price = price * quantity;

    // ✅ Prepare base cart data
    const cartData = {
      id: crypto.randomUUID(),
      customer_id: data.customer_id,
      email: data.email,
      product_id: crypto.randomUUID(),
      product_type: data.product_type,
      quantity,
      price,
      total_price,
    };

    // ✅ If product is designable, include design-related fields
    if (data.product_type === "Designable") {
      if (!data.designs || !Array.isArray(data.designs)) {
        throw new Error(
          "Designs must be provided as an array for designable products."
        );
      }
      cartData.designs = data.designs;
      cartData.design_state = data.design_state || {};
      cartData.props_state = data.props_state || {};
    }

    return await Cart.create(cartData);
  }

  /**
   * ✅ Get all cart items for a customer
   */
  async getCartByCustomer(customer_id) {
    const cartItems = await Cart.findAll({ where: { customer_id } });

    const designableProducts = [];
    const standardProducts = [];

    for (const item of cartItems) {
      if (item.product_type === "Designable") {
        // ✅ Push designable products as they are
        designableProducts.push(item);
      } else {
        // ✅ Fetch Standard Product Details
        const product = await StandardProduct.findByPk(item.product_id);
        if (product) {
          standardProducts.push({ ...item.toJSON(), product_details: product });
        }
      }
    }

    return {
      designable_products: designableProducts,
      standard_products: standardProducts,
    };
  }

  /**
   * ✅ Update cart item (Handles updates for both product types)
   */
  async updateCart(cartId, updates) {
    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem) throw new Error("Cart item not found");

    // Update price and total price if quantity is changed
    if (updates.quantity) {
      updates.total_price = cartItem.price * updates.quantity;
    }

    const updatedCart = await cartItem.update(updates);
    return updatedCart;
  }

  /**
   * ✅ Update Cart Quantity
   */
  async updateCartQuantity(cartId, newQuantity) {
    const cart = await Cart.findByPk(cartId);
    if (!cart) throw new Error(`Cart with ID ${cartId} not found.`);

    if (newQuantity <= 0) {
      throw new Error("Quantity must be greater than zero.");
    }

    // ✅ Update total price based on the new quantity
    const updatedTotalPrice = cart.price * newQuantity;

    return await cart.update({
      quantity: newQuantity,
      total_price: updatedTotalPrice,
    });
  }

  /**
   * ✅ Delete a single cart item
   */
  async deleteCart(cartId) {
    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem) throw new Error("Cart item not found");

    await cartItem.destroy();
    return { message: "Cart item deleted successfully" };
  }

  /**
   * ✅ Clear all cart items for a customer
   */
  async clearCustomerCart(customer_id) {
    await Cart.destroy({ where: { customer_id } });
    return { message: "All cart items cleared" };
  }
}

module.exports = new CartService();
