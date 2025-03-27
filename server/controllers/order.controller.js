const orderService = require("../services/order.service");
const crypto = require("crypto");

const PHONEPE_UAT_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const MERCHANT_ID = "PGTESTPAYUAT"; // Replace with your UAT Merchant ID
const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"; // Replace with your UAT Salt Key
const SALT_INDEX = "1";

// Temporary in-memory store for order data (replace with DB in production)
const tempOrderStore = new Map();

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
 * Create a new order (direct creation, not via PhonePe).
 */
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const order = await orderService.createOrder(orderData);
    res.status(201).json({ success: true, data: order, message: "Order created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.initiatePhonePePayment = async (req, res) => {
  try {
    const { orderData, amount } = req.body;
    const merchantTransactionId = `MT${Date.now()}`;
    // Create the order first with validation
    const order = await orderService.createOrder({
      ...orderData,
      payment_status: "awaiting",
      merchant_transaction_id: merchantTransactionId,
    });

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: orderData.customer_id,
      amount,
      redirectUrl: `${process.env.BASE_URL}/app/order-confirmation`,
      redirectMode: "REDIRECT",
      callbackUrl: `${process.env.BASE_URL}/api/orders/phonepe/callback`,
      mobileNumber: "9999999999",
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
    const xVerify = crypto
      .createHash("sha256")
      .update(base64Payload + "/pg/v1/pay" + SALT_KEY)
      .digest("hex") + "###" + SALT_INDEX;

    const response = await fetch(`${PHONEPE_UAT_URL}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerify,
        Accept: "application/json",
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const paymentData = await response.json();

    if (response.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Payment failed due to too many requests, but order placed successfully",
        orderId: order.id,
        retryAfter: response.headers.get("Retry-After") || 60,
      });
    }

    if (!response.ok || !paymentData.success) {
      return res.status(200).json({
        success: false,
        message: "Payment failed, but order placed successfully",
        orderId: order.id,
        paymentError: paymentData.message || "Failed to initiate PhonePe payment",
      });
    }

    tempOrderStore.set(merchantTransactionId, orderData);

    res.status(200).json({
      success: true,
      data: paymentData.data,
      merchantTransactionId,
      orderId: order.id,
    });
  } catch (error) {
    console.error("PhonePe initiation error:", error.message);
    res.status(400).json({ success: false, message: error.message }); // Changed to 400 for client errors
  }
};

// Update handlePhonePeCallback to use retrieveByTransactionId
exports.handlePhonePeCallback = async (req, res) => {
  try {
    const { merchantTransactionId, responseCode } = req.body;

    if (!merchantTransactionId || !tempOrderStore.has(merchantTransactionId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing transaction ID" });
    }

    if (responseCode === "SUCCESS") {
      const statusResponse = await checkPaymentStatus(merchantTransactionId);
      if (statusResponse.success && statusResponse.data.code === "PAYMENT_SUCCESS") {
        const order = await orderService.retrieveByTransactionId(merchantTransactionId);
        if (order) {
          await order.update({ payment_status: "captured" });
        } else {
          const orderData = tempOrderStore.get(merchantTransactionId);
          await orderService.createOrder({
            ...orderData,
            payment_status: "captured",
            merchant_transaction_id: merchantTransactionId,
          });
        }
        tempOrderStore.delete(merchantTransactionId);
        return res.redirect(302, "/order-confirmation");
      }
    }

    tempOrderStore.delete(merchantTransactionId);
    return res.redirect(302, "/order-failure");
  } catch (error) {
    console.error("Callback error:", error.message);
    tempOrderStore.delete(req.body.merchantTransactionId);
    res.status(500).json({ success: false, message: "Callback processing failed" });
  }
};

/**
 * Check PhonePe payment status.
 */
exports.checkPhonePeStatus = async (req, res) => {
  try {
    const { merchantTransactionId } = req.body;
    const status = await checkPaymentStatus(merchantTransactionId);
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    console.error("Status check error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Utility function to check payment status.
 */
const checkPaymentStatus = async (merchantTransactionId) => {
  const endpoint = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
  const xVerify = crypto
    .createHash("sha256")
    .update(endpoint + SALT_KEY)
    .digest("hex") + "###" + SALT_INDEX;

  const response = await fetch(`${PHONEPE_UAT_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": xVerify,
      "X-MERCHANT-ID": MERCHANT_ID,
      Accept: "application/json",
    },
  });

  return await response.json();
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

/**
 * Update order status (fulfillment or payment)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, value } = req.body;
    
    if (!type || !value) {
      return res.status(400).json({ 
        success: false, 
        message: "Status type and value are required" 
      });
    }
    
    const order = await orderService.updateOrderStatus(id, type, value);
    
    res.status(200).json({ 
      success: true, 
      message: "Order status updated successfully",
      data: order
    });
    
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};