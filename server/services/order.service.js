const Order = require("../models/order.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const stockService = require("../services/stock.service");

const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}
class OrderService {
  /**
   * Retrieve an order by ID.
   */
  async retrieve(orderId) {
    if (!orderId) {
      throw new Error("Order ID is required.");
    }

    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found.`);
    }
    return order;
  }

  /**
   * Create a new order.
   */
  
  async createOrder(orderData) {
      if (!orderData.vendor_id) {
        throw new Error("Vendor ID is required to create an order.");
      }
  
      if (!orderData.store_id) {
        throw new Error("Store ID is required to create an order.");
      }
  
      const transaction = await sequelize.transaction();
  
      try {
        const orderId = generateEntityId("order");
        const newOrder = await Order.create({
          id: orderId,
          vendor_id: orderData.vendor_id,
          store_id: orderData.store_id,
          status: orderData.status || "pending",
          fulfillment_status: orderData.fulfillment_status || "not_fulfilled",
          payment_status: orderData.payment_status || "awaiting",
          total_amount: orderData.total_amount,
          line_items: orderData.line_items,
          currency_code: orderData.currency_code,
          customer_id: orderData.customer_id,
          email: orderData.email,
          public_api_key: orderData.public_api_key || null,
        }, { transaction });
  
        // Update stock for each standard product's variant
        for (const item of orderData.line_items) {
          if (item.product_type === "standard" && item.selected_variant && item.quantity) {
            await stockService.placeOrder(item.selected_variant, item.quantity, transaction);
          }
        }
  
        await transaction.commit();
        return newOrder;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }

  /**
   * List all orders for a vendor.
   */
  async listOrdersByVendor(vendorId) {
    if (!vendorId) {
      throw new Error("Vendor ID is required.");
    }

    return await Order.findAll({ where: { vendor_id: vendorId } });
  }

  /**
   * List all orders with optional filters.
   */
  async getAllOrders() {
    return await Order.findAll();
  }

  /**
   * Delete an order by ID.
   */
  async deleteOrder(orderId) {
    if (!orderId) {
      throw new Error("Order ID is required.");
    }

    const order = await this.retrieve(orderId);
    await order.destroy();
  }
}

module.exports = new OrderService();
