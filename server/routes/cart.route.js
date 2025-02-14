const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Cart management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - customer_id
 *         - email
 *         - product_id
 *         - product_type
 *         - quantity
 *         - price
 *         - total_price
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the cart item
 *         customer_id:
 *           type: string
 *           description: The ID of the customer
 *         email:
 *           type: string
 *           description: The email of the customer
 *         product_id:
 *           type: string
 *           description: The ID of the product
 *         product_type:
 *           type: string
 *           enum: [designable, standard]
 *           description: The type of product (designable or standard)
 *         designs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               side:
 *                 type: string
 *               image:
 *                 type: string
 *               jsonDesign:
 *                 type: object
 *                 description: JSON representation of design
 *           description: Design configurations (only for designable products)
 *         design_state:
 *           type: object
 *           description: State of the design, including zoom and rotation (only for designable products)
 *         props_state:
 *           type: object
 *           description: Properties like color and font (only for designable products)
 *         quantity:
 *           type: integer
 *           description: Quantity of the product in the cart
 *         price:
 *           type: number
 *           format: float
 *           description: Price per unit of the product
 *         total_price:
 *           type: number
 *           format: float
 *           description: Total price (quantity * price)
 *       example:
 *         id: "cart_001"
 *         customer_id: "12345"
 *         email: "customer@example.com"
 *         product_id: "design_001"
 *         product_type: "designable"
 *         designs:
 *           - side: "front"
 *             image: "https://example.com/design-front.png"
 *             jsonDesign: { "objects": [ { "type": "text", "text": "Custom Name" } ] }
 *         design_state: { "zoom": 1.2, "rotation": 0 }
 *         props_state: { "color": "red", "font_family": "Arial" }
 *         quantity: 2
 *         price: 50.0
 *         total_price: 100.0
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: Cart item added successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", cartController.createCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   get:
 *     summary: Get a cart item by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart item not found
 */
router.get("/:id", cartController.getCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   put:
 *     summary: Update a cart item
 *     tags: [Carts]
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
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       404:
 *         description: Cart item not found
 */
router.put("/:id", cartController.updateCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   delete:
 *     summary: Remove a cart item
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *       404:
 *         description: Cart item not found
 */
router.delete("/:id", cartController.deleteCart);

/**
 * @swagger
 * /api/carts/customer/{customerId}:
 *   get:
 *     summary: Retrieve all cart items for a customer
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer's cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 designable_products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cart'
 *                 standard_products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cart'
 *       404:
 *         description: No cart items found for the customer
 */
router.get("/customer/:customerId", cartController.getCartsByCustomer);

/**
 * @swagger
 * /api/carts/customer/{customerId}:
 *   delete:
 *     summary: Clear all cart items for a customer
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer's cart cleared successfully
 *       404:
 *         description: No cart items found for the customer
 */
router.delete("/customer/:customerId", cartController.clearCustomerCart);

/**
 * @swagger
 * /api/carts/{id}/quantity:
 *   patch:
 *     summary: Update the quantity of a cart item
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: New quantity of items in the cart
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item quantity updated successfully
 *       400:
 *         description: Invalid input or cart item not found
 */
router.patch("/:id/quantity", cartController.updateCartQuantity);

module.exports = router;
