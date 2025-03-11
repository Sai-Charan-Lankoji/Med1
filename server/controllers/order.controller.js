const orderService = require("../services/order.service");

/**
 * Retrieve an order by ID.
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderService.retrieve(id);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/**
 * Create a new order.
 */
exports.createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: order, message: "Order created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * List all orders for a specific vendor.
 */
exports.listOrdersByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const orders = await orderService.listOrdersByVendor(vendorId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * List all orders.
 */
exports.listOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Delete an order by ID.
 */
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await orderService.deleteOrder(id);
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

/**
 * List all orders for a specific customer.
 */
exports.listOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await orderService.listOrdersByCustomer(customerId);
    if (orders.length === 0) {
      return res.status(200).json({ success: true, data: [], message: "No orders found for this customer" });
    }
    res.status(200).json({ success: true, data: orders, message: "Orders retrieved successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};