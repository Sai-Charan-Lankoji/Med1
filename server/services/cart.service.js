const Cart = require("../models/cart.model");
const StandardProduct = require("../models/standardProduct.model"); // Standard Products
const crypto = require("crypto");

class CartService {
  /**
   * Create a new cart item
   */
  async createCart(data) {
    if (!data.customer_id || !data.product_id || !data.product_type) {
      throw new Error(
        "Missing required fields: customer_id, product_id, product_type"
      );
    }

    let price = data.price;
    let total_price = price * data.quantity;

    const cartData = {
      id: crypto.randomUUID(),
      customer_id: data.customer_id,
      email: data.email,
      product_id: data.product_id,
      product_type: data.product_type,
      quantity: data.quantity,
      price,
      total_price,
      ...(data.product_type === "designable" && {
        designs: data.designs,
        design_state: data.design_state,
        props_state: data.props_state,
      }),
    };

    return await Cart.create(cartData);
  }

  /**
   * Get a single cart item by ID
   */
  async getCartById(cartId) {
    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem) throw new Error(`Cart item with ID ${cartId} not found`);
    return cartItem;
  }

  /**
   * Get all cart items for a specific customer
   */
  async getCartByCustomer(customer_id) {
    const cartItems = await Cart.findAll({ where: { customer_id } });

    const designableProducts = [];
    const standardProducts = [];

    for (const item of cartItems) {
      if (item.product_type === "designable") {
        designableProducts.push(item);
      } else {
        // Fetch Standard Product Details
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
   * Update a cart item by ID
   */
  async updateCart(cartId, updates) {
    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem) throw new Error(`Cart item with ID ${cartId} not found`);

    return await cartItem.update(updates);
  }

  /**
   * Delete a single cart item by ID
   */
  async deleteCart(cartId) {
    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem) throw new Error(`Cart item with ID ${cartId} not found`);

    await cartItem.destroy();
    return { message: "Cart item deleted successfully" };
  }

  /**
   * Clear all cart items for a specific customer
   */
  async clearCustomerCart(customer_id) {
    await Cart.destroy({ where: { customer_id } });
    return { message: "All cart items cleared" };
  }

  /**
   * Update the quantity of a cart item
   */
  async updateCartQuantity(cartId, newQuantity) {
    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem) throw new Error(`Cart item with ID ${cartId} not found`);

    if (newQuantity <= 0) {
      throw new Error("Quantity must be greater than zero.");
    }

    const updatedTotalPrice = cartItem.price * newQuantity;

    return await cartItem.update({
      quantity: newQuantity,
      total_price: updatedTotalPrice,
    });
  }
}

module.exports = new CartService();
