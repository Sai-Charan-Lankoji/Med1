// services/cart.service.js
const Cart2 = require("../models/cart2.model");
const StandardProduct = require("../models/standardProduct.model");
const Product = require("../models/product.model");
const StockService = require("./stock.service"); // Import StockService
const crypto = require("crypto");

class CartService {
  async createCart(data) {
    if (!data.customer_id || !data.product_type) {
      throw new Error("Missing required fields: customer_id, product_type");
    }

    let price;
    if (data.product_type === "designable") {
      if (data.product_id) {
        const product = await Product.findByPk(data.product_id);
        if (!product) throw new Error("Designable product not found");
        price = product.price;
      } else {
        data.product_id = `custom-${crypto.randomUUID()}`;
        price = data.price || 0.0;
      }
    } else {
      const standardProduct = await StandardProduct.findByPk(data.product_id);
      if (!standardProduct) throw new Error("Standard product not found");

      if (data.selected_variant) {
        // Use getStockVariantById instead of getStockByStockId
        const variant = await StockService.getStockVariantById(data.selected_variant);
        if (!variant) throw new Error("Variant not found");

        // Validate stock_id matches
        if (variant.stock_id !== standardProduct.stock_id) {
          throw new Error("Variant does not belong to this product's stock");
        }

        // Validate size and color
        

        // Check availability
        const quantity = data.quantity || 1;
        if (variant.availableQuantity < quantity) {
          throw new Error(`Only ${variant.availableQuantity} left for this variant`);
        }

        price = standardProduct.price; // Use product price; adjust if variant has its own price
      } else {
        price = standardProduct.price;
      }
    }

    if (data.product_type === "standard") {
      const existingCartItem = await Cart2.findOne({
        where: {
          customer_id: data.customer_id,
          product_id: data.product_id,
          product_type: "standard",
          selected_size: data.selected_size || null,
          selected_color: data.selected_color || null, // Hex string
          selected_variant: data.selected_variant || null,
        },
      });

      if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + (data.quantity || 1);
        if (data.selected_variant) {
          const variant = await StockService.getStockVariantById(data.selected_variant);
          if (!variant) throw new Error("Variant not found");
          if (variant.availableQuantity < newQuantity) {
            throw new Error(`Only ${variant.availableQuantity} left for this variant`);
          }
        }
        const updatedTotalPrice = price * newQuantity;

        await existingCartItem.update({
          quantity: newQuantity,
          total_price: updatedTotalPrice,
          selected_variant: data.selected_variant || existingCartItem.selected_variant,
        });

        return existingCartItem;
      }
    }

    const quantity = data.quantity || 1;
    const total_price = price * quantity;

    const cartData = {
      id: crypto.randomUUID(),
      customer_id: data.customer_id,
      email: data.email,
      product_id: data.product_id || null,
      product_type: data.product_type,
      quantity,
      price,
      total_price,
      selected_size: data.selected_size || null,
      selected_color: data.selected_color || null, // Hex string
      selected_variant: data.selected_variant || null,
    };

    if (data.product_type === "designable") {
      cartData.designs = data.designs || null;
      cartData.designState = data.designState || null;
      cartData.propsState = data.propsState || null;
    }

    return await Cart2.create(cartData);
  }

  async updateCart(cartId, updates) {
    const cartItem = await Cart2.findByPk(cartId);
    if (!cartItem) throw new Error("Cart item not found");

    const allowedUpdates = {};
    if (cartItem.product_type === "designable") {
      allowedUpdates.designs = updates.designs || cartItem.designs;
      allowedUpdates.designState = updates.designState || cartItem.designState;
      allowedUpdates.propsState = updates.propsState || cartItem.propsState;
      allowedUpdates.quantity = updates.quantity || cartItem.quantity;
    } else {
      allowedUpdates.quantity = updates.quantity || cartItem.quantity;
      if (updates.quantity && cartItem.selected_variant) {
        const variant = await StockService.getStockVariantById(cartItem.selected_variant);
        if (!variant) throw new Error("Variant not found");
        if (variant.availableQuantity < updates.quantity) {
          throw new Error(`Only ${variant.availableQuantity} left for this variant`);
        }
      }
    }

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