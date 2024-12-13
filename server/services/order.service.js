const Order = require("../models/order.model");

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

    const newOrder = await Order.create({
      ...orderData,
      status: orderData.status || "pending", // Default to pending
      line_items: orderData.line_items || [],
    });

    return newOrder;
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
