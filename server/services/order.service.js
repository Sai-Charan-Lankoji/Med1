const Order = require("../models/order.model");
const Customer = require("../models/customer.model"); // Add this
const crypto = require("crypto");
const sequelize = require("../config/db");
const stockService = require("../services/stock.service");

const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

class OrderService {
  /**
   * Validate that a customer_id exists in the customers table.
   */
  async validateCustomerId(customerId) {
    if (!customerId) {
      throw new Error("Customer ID is required.");
    }
    const customer = await Customer.findOne({ where: { id: customerId } });
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found in the database.`);
    }
    return true;
  }

/**
   * Update an order's status (fulfillment or payment)
   */
async updateOrderStatus(orderId, type, value) {
  const order = await this.retrieve(orderId);
  
  if (type !== 'fulfillment_status' && type !== 'payment_status') {
    throw new Error('Invalid status type. Must be "fulfillment_status" or "payment_status"');
  }
  
  // Create update object with the specific field to update
  const updateData = {};
  updateData[type] = value;
  
  await order.update(updateData);
  return order;
}

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
   * Create a new order with customer_id validation.
   */
  async createOrder(orderData) {
    if (!orderData.customer_id) {
      throw new Error("Customer ID is required to create an order.");
    }

    // Validate customer_id exists
    await this.validateCustomerId(orderData.customer_id);

    const transaction = await sequelize.transaction();
    try {
      const orderId = generateEntityId("order");
      const newOrder = await Order.create(
        {
          id: orderId,
          vendor_id: orderData.vendor_id || null,
          store_id: orderData.store_id || null,
          status: orderData.status || "pending",
          fulfillment_status: orderData.fulfillment_status || "not_fulfilled",
          payment_status: orderData.payment_status || "awaiting",
          total_amount: orderData.total_amount || 0,
          line_items: orderData.line_items || [],
          currency_code: orderData.currency_code || "INR",
          customer_id: orderData.customer_id,
          email: orderData.email || null,
          public_api_key: orderData.public_api_key || null,
          shipping_address: orderData.shipping_address || null,
          billing_address: orderData.billing_address || null,
          merchant_transaction_id: orderData.merchant_transaction_id || null,
        },
        { transaction }
      );

      for (const item of orderData.line_items || []) {
        if (item.product_type === "standard" && item.selected_variant && item.quantity) {
          await stockService.placeOrder(item.selected_variant, item.quantity, transaction);
        }
      }

      await transaction.commit();
      return newOrder;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  /**
   * Retrieve an order by merchant_transaction_id.
   */
  async retrieveByTransactionId(merchantTransactionId) {
    if (!merchantTransactionId) {
      throw new Error("Merchant Transaction ID is required.");
    }
    return await Order.findOne({ where: { merchant_transaction_id: merchantTransactionId } });
  }

  async listOrdersByVendor(vendorId) {
    if (!vendorId) {
      throw new Error("Vendor ID is required.");
    }
    return await Order.findAll({ where: { vendor_id: vendorId } });
  }

  async getAllOrders() {
    return await Order.findAll();
  }

  async deleteOrder(orderId) {
    if (!orderId) {
      throw new Error("Order ID is required.");
    }
    const order = await this.retrieve(orderId);
    await order.destroy();
  }

  async listOrdersByCustomer(customerId) {
    if (!customerId) {
      throw new Error("Customer ID is required.");
    }
    return await Order.findAll({ where: { customer_id: customerId } });
  }
}

module.exports = new OrderService();