const Cart2 = require("../models/cart2.model");
const StandardProduct = require("../models/standardProduct.model");
const Product = require("../models/product.model");
const crypto = require("crypto");

class CartService {
  async createCart(data) {
    if (!data.customer_id || !data.product_type) {
      throw new Error("Missing required fields: customer_id, product_type");
    }

    if (data.product_type === "designable") {
      if (data.product_id) {
        const product = await Product.findByPk(data.product_id);
        if (!product) throw new Error("Designable product not found");
        data.price = product.price;
      } else {
        data.product_id = `custom-${crypto.randomUUID()}`;
        data.price = data.price || 0.0;
      }
    } else {
      const standardProduct = await StandardProduct.findByPk(data.product_id);
      if (!standardProduct) throw new Error("Standard product not found");
      data.price = standardProduct.price;
    }

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

    const quantity = data.quantity || 1;
    const total_price = data.price * quantity;

    const cartData = {
      id: crypto.randomUUID(),
      customer_id: data.customer_id,
      email: data.email,
      product_id: data.product_id || null,
      product_type: data.product_type,
      quantity,
      price: data.price,
      total_price,
    };

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

  async updateCart(cartId, updates) {
    const cartItem = await Cart2.findByPk(cartId);
    if (!cartItem) throw new Error("Cart item not found");

    // Prepare update object based on product type
    const allowedUpdates = {};

    if (cartItem.product_type === "designable") {
      // For designable items, allow updating designs, designState, propsState, and quantity
      allowedUpdates.designs = updates.designs || cartItem.designs;
      allowedUpdates.designState = updates.designState || cartItem.designState;
      allowedUpdates.propsState = updates.propsState || cartItem.propsState;
      allowedUpdates.quantity = updates.quantity || cartItem.quantity;
    } else {
      // For standard items, only allow quantity updates
      allowedUpdates.quantity = updates.quantity || cartItem.quantity;
    }

    // Recalculate total_price if quantity changes
    if (updates.quantity) {
      allowedUpdates.total_price = cartItem.price * allowedUpdates.quantity;
    }

    return await cartItem.update(allowedUpdates);
  }

  async getCartById(id) {
    const cartItem = await Cart2.findByPk(id);
    if (!cartItem) throw new Error("Cart item not found");
    return cartItem;
  }

  async getCartByCustomer(customerId) {
    const cartItems = await Cart2.findAll({
      where: { customer_id: customerId },
    });

    const designableProducts = [];
    const standardProductIds = [];
    const standardProductsMap = new Map();

    for (const item of cartItems) {
      if (item.product_type === "designable") {
        const itemData = item.toJSON();
        if (itemData.designs) {
          itemData.designs = itemData.designs.map((design) => {
            const { jsonDesign, ...rest } = design;
            return rest;
          });
        }
        designableProducts.push(itemData);
      } else {
        standardProductIds.push(item.product_id);
      }
    }

    let standardProducts = [];
    if (standardProductIds.length > 0) {
      const standardProductsData = await StandardProduct.findAll({
        where: { id: standardProductIds },
      });

      standardProductsData.forEach((product) => {
        standardProductsMap.set(product.id, product);
      });

      standardProducts = cartItems
        .filter((item) => item.product_type !== "designable")
        .map((item) => ({
          ...item.toJSON(),
          product_details: standardProductsMap.get(item.product_id) || null,
        }));
    }

    return {
      designable_products: designableProducts,
      standard_products: standardProducts,
    };
  }

  async updateCartQuantity(cartId, newQuantity) {
    // Redirect to updateCart for consistency
    return await this.updateCart(cartId, { quantity: newQuantity });
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
