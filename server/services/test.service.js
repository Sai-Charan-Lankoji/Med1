const Cart2 = require("../models/cart2.model");
const StandardProduct = require("../models/standardProduct.model");
const Product = require("../models/product.model");
const crypto = require("crypto");

class CartService {
  /**
   * ✅ Create a cart item (Handles both Standard & Designable Products)
   */
  async createCart(data) {
    if (!data.customer_id || !data.product_id || !data.product_type) {
      throw new Error(
        "Missing required fields: customer_id, product_id, product_type"
      );
    }

    // Check if the product already exists in the cart
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
        // ✅ If product exists with same size/color, update quantity
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
      product_id: data.product_id,
      product_type: data.product_type,
      quantity,
      price,
      total_price,
    };

    // ✅ If product is designable, include design-related fields
    if (data.product_type === "designable") {
      if (data.designs) {
        cartData.designs = data.designs;
      }
      if (data.designState) {
        cartData.designState = data.designState;
      }
      if (data.propsState) {
        cartData.propsState = data.propsState;
      }
    } 
    // ✅ If product is standard, include standard product specific fields
    else if (data.product_type === "standard") {
      if (data.selected_size) {
        cartData.selected_size = data.selected_size;
      }
      if (data.selected_color) {
        cartData.selected_color = data.selected_color;
      }
    }

    return await Cart2.create(cartData);
  }

  /**
   * ✅ Get all cart items for a customer
   */
  async getCartByCustomer(customer_id) {
    const cartItems = await Cart2.findAll({ 
      where: { customer_id },
      include: [
        {
          model: Product,
          as: 'designable_product',
          required: false
        },
        {
          model: StandardProduct,
          as: 'standard_product',
          required: false
        }
      ]
    });

    // Process and organize cart items by product type
    const designableProducts = [];
    const standardProducts = [];

    for (const item of cartItems) {
      const itemData = item.toJSON();
      
      if (item.product_type === "designable") {
        // Clean designs data if needed
        if (itemData.designs) {
          itemData.designs = Array.isArray(itemData.designs) 
            ? itemData.designs.map(design => {
                const { jsonDesign, ...rest } = design; // Exclude jsonDesign if present
                return rest;
              })
            : itemData.designs;
        }
        
        // Add product details from the association
        itemData.product_details = itemData.designable_product || null;
        delete itemData.designable_product;
        delete itemData.standard_product;
        
        designableProducts.push(itemData);
      } else {
        // Add product details from the association
        itemData.product_details = itemData.standard_product || null;
        delete itemData.designable_product;
        delete itemData.standard_product;
        
        standardProducts.push(itemData);
      }
    }

    return {
      designable_products: designableProducts,
      standard_products: standardProducts
    };
  }

  /**
   * ✅ Update cart item (Handles updates for both product types)
   */
  async updateCart(cartId, updates) {
    const cartItem = await Cart2.findByPk(cartId);
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
    const cart = await Cart2.findByPk(cartId);
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
    const cartItem = await Cart2.findByPk(cartId);
    if (!cartItem) throw new Error("Cart item not found");

    await cartItem.destroy();
    return { message: "Cart item deleted successfully" };
  }

  /**
   * ✅ Clear all cart items for a customer
   */
  async clearCustomerCart(customer_id) {
    await Cart2.destroy({ where: { customer_id } });
    return { message: "All cart items cleared" };
  }

  async updateCustomerDetails(id, updateData) {
    try {
      const customer = await Customer.findByIdAndUpdate(id, updateData, { new: true });
      if (!customer) {
        throw new Error("Customer not found.");
      }
      return customer;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = new CartService();

