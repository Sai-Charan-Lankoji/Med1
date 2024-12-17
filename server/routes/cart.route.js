const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: Cart created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', cartController.createCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   get:
 *     summary: Get a cart by ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 */
router.get('/:id', cartController.getCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   put:
 *     summary: Update a cart
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
 *         description: Cart updated successfully
 *       404:
 *         description: Cart not found
 */
router.put('/:id', cartController.updateCart);

/**
 * @swagger
 * /api/carts/{id}:
 *   delete:
 *     summary: Delete a cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: Cart not found
 */
router.delete('/:id', cartController.deleteCart);

/**
 * @swagger
 * /api/carts/customer/{customerId}:
 *   get:
 *     summary: Get all carts for a customer
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of carts for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Customer not found or no carts
 */
router.get('/customer/:customerId', cartController.getCartsByCustomer);

/**
 * @swagger
 * /api/carts/customer/{customerId}:
 *   delete:
 *     summary: Clear all carts for a customer
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer carts cleared successfully
 *       404:
 *         description: Customer not found or no carts
 */
router.delete('/customer/:customerId', cartController.clearCustomerCart);


/**
 * @swagger
 * /api/carts/{id}/quantity:
 *   patch:
 *     summary: Update the quantity of a cart
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart
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
 *         description: Cart quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid input or cart not found
 */
router.patch('/:id/quantity', cartController.updateCartQuantity);

module.exports = router;
