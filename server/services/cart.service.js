const Cart2 = require("../models/cart2.model");
const StandardProduct = require("../models/standardProduct.model");
const Product = require("../models/product.model");
const crypto = require("crypto");

class CartService {
  async createCart(data) {
    if (!data.customer_id || !data.product_id || !data.product_type) {
      throw new Error("Missing required fields: customer_id, product_id, product_type");
    }

    // Validate product existence
    if (data.product_type === "designable") {
      const product = await Product.findByPk(data.product_id);
      if (!product) throw new Error("Designable product not found");
      data.price = product.price;
    } else {
      const standardProduct = await StandardProduct.findByPk(data.product_id);
      if (!standardProduct) throw new Error("Standard product not found");
      data.price = standardProduct.price;
    }

    // Check for existing standard product in cart
    if (data.product_type === "standard") {
      const existingCartItem = await Cart2.findOne({
        where: {
          customer_id: data.customer_id,
          product_id: data.product_id,
          product_type: "standard",
          selected_size: data.selected_size || null,
          selected_color: data.selected_color || null,
        },
      });

      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + (data.quantity || 1);
        const updatedTotalPrice = existingCartItem.price * newQuantity;

        await existingCartItem.update({
          quantity: newQuantity,
          total_price: updatedTotalPrice,
        });

        return existingCartItem;
      }
    }

    // Prepare cart data
    const quantity = data.quantity || 1;
    const total_price = data.price * quantity;

    const cartData = {
      id: crypto.randomUUID(),
      customer_id: data.customer_id,
      email: data.email,
      product_id: data.product_id,
      product_type: data.product_type,
      quantity,
      price: data.price,
      total_price,
    };

    // Add type-specific fields
    if (data.product_type === "designable") {
      cartData.designs = data.designs || null;
      cartData.designState = data.designState || null;
      cartData.propsState = data.propsState || null;
    } else {
      cartData.selected_size = data.selected_size || null;
      cartData.selected_color = data.selected_color || null;
    }

    return await Cart2.create(cartData);
  }

  async getCartById(id) {
    const cartItem = await Cart2.findByPk(id);
    if (!cartItem) throw new Error("Cart item not found");
    return cartItem;
  }

  async getCartByCustomer(customerId) {
    // Get cart items for the specific customer
    const cartItems = await Cart2.findAll({ 
        where: { customer_id: customerId }
    });  

    const designableProducts = [];
    const standardProductIds = [];
    const standardProductsMap = new Map();

    // Process each cart item
    for (const item of cartItems) {
        if (item.product_type === "designable") {
            const itemData = item.toJSON();
            if (itemData.designs) {
                itemData.designs = itemData.designs.map(design => {
                    const { jsonDesign, ...rest } = design;
                    return rest;
                });
            }
            designableProducts.push(itemData);
        } else {
            standardProductIds.push(item.product_id);
        }
    }

    // Batch fetch standard products
    let standardProducts = [];
    if (standardProductIds.length > 0) {
        const standardProductsData = await StandardProduct.findAll({
            where: { id: standardProductIds }
        });

        standardProductsData.forEach(product => {
            standardProductsMap.set(product.id, product);
        });

        // Map standard products with cart items
        standardProducts = cartItems
            .filter(item => item.product_type !== "designable")
            .map(item => ({
                ...item.toJSON(),
                product_details: standardProductsMap.get(item.product_id) || null
            }));
    }

    return {
        designable_products: designableProducts,
        standard_products: standardProducts
    };
}

  async updateCart(cartId, updates) {
    const cartItem = await Cart2.findByPk(cartId);
    if (!cartItem) throw new Error("Cart item not found");

    if (updates.quantity) {
      updates.total_price = cartItem.price * updates.quantity;
    }

    return await cartItem.update(updates);
  }

  async updateCartQuantity(cartId, newQuantity) {
    const cart = await Cart2.findByPk(cartId);
    if (!cart) throw new Error("Cart item not found");

    const updatedTotalPrice = cart.price * newQuantity;

    return await cart.update({
      quantity: newQuantity,
      total_price: updatedTotalPrice,
    });
  }

  async deleteCart(cartId) {
    const cartItem = await Cart2.findByPk(cartId);
    if (!cartItem) throw new Error("Cart item not found");
    await cartItem.destroy();
    return { message: "Cart item deleted successfully" };
  }

  async clearCustomerCart(customer_id) {
    await Cart2.destroy({ where: { customer_id } });
    return { message: "All cart items cleared" };
  }
}

module.exports = new CartService();