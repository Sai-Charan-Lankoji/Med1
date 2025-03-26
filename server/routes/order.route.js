const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", orderController.listOrders); // List all orders

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get("/:id", orderController.getOrderById); // Get an order by ID

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 */
router.post("/", orderController.createOrder); // Create a new order

/**
 * @swagger
 * /api/orders/phonepe/initiate:
 *   post:
 *     summary: Initiate a PhonePe payment
 *     tags: [PhonePe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderData
 *               - amount
 *             properties:
 *               orderData:
 *                 type: object
 *                 properties:
 *                   customer_id:
 *                     type: string
 *                     description: Unique ID of the customer
 *                   email:
 *                     type: string
 *                     description: Customer's email address
 *                   line_items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         product_id:
 *                           type: string
 *                         quantity:
 *                           type: integer
 *                         price:
 *                           type: number
 *                   total_amount:
 *                     type: number
 *                   shipping_address:
 *                     type: object
 *                   billing_address:
 *                     type: object
 *               amount:
 *                 type: integer
 *                 description: Amount in paise (e.g., 10000 for 100 INR)
 *     responses:
 *       200:
 *         description: Payment initiation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     instrumentResponse:
 *                       type: object
 *                       properties:
 *                         redirectInfo:
 *                           type: object
 *                           properties:
 *                             url:
 *                               type: string
 *                 merchantTransactionId:
 *                   type: string
 *       500:
 *         description: Failed to initiate payment
 */
router.post("/phonepe/initiate", orderController.initiatePhonePePayment);

/**
 * @swagger
 * /api/orders/phonepe/callback:
 *   post:
 *     summary: Handle PhonePe payment callback
 *     tags: [PhonePe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - merchantTransactionId
 *               - responseCode
 *             properties:
 *               merchantTransactionId:
 *                 type: string
 *                 description: Unique transaction ID from PhonePe
 *               responseCode:
 *                 type: string
 *                 description: Response code from PhonePe (e.g., SUCCESS)
 *     responses:
 *       302:
 *         description: Redirects to order confirmation or failure page
 *       400:
 *         description: Invalid or missing transaction ID
 *       500:
 *         description: Callback processing failed
 */
router.post("/phonepe/callback", orderController.handlePhonePeCallback);

/**
 * @swagger
 * /api/orders/phonepe/status:
 *   post:
 *     summary: Check PhonePe payment status
 *     tags: [PhonePe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - merchantTransactionId
 *             properties:
 *               merchantTransactionId:
 *                 type: string
 *                 description: Unique transaction ID from PhonePe
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       description: Status code (e.g., PAYMENT_SUCCESS)
 *       500:
 *         description: Failed to check payment status
 */
router.post("/phonepe/status", orderController.checkPhonePeStatus);

/**
 * @swagger
 * /api/orders/vendor/{vendorId}:
 *   get:
 *     summary: List orders by vendor
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of orders for the vendor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Vendor ID required or no orders found
 */
router.get("/vendor/:vendorId", orderController.listOrdersByVendor); // List orders by vendor

/**
 * @swagger
 * /api/orders/customer/{customerId}:
 *   get:
 *     summary: List orders by customer
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of orders for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       400:
 *         description: Customer ID required or error occurred
 */
router.get("/customer/:customerId", orderController.listOrdersByCustomer); // List orders by customer

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete("/:id", orderController.deleteOrder); // Delete an order by ID

// Add this route

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (fulfillment or payment)
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [fulfillment_status, payment_status]
 *               value:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid input
 */
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;