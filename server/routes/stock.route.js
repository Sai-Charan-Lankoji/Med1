// routes/stockRoute.js
const express = require("express");
const stockController = require("../controllers/stock.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Stock
 *   description: API for managing stock and variants
 */

/**
 * @swagger
 * /api/stock:
 *   post:
 *     summary: Create a new stock entry with variants
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - variants
 *             properties:
 *               title:
 *                 type: string
 *                 example: Batch 1
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                       example: M
 *                     color:
 *                       type: string
 *                       example: Black
 *                     totalQuantity:
 *                       type: integer
 *                       example: 100
 *     responses:
 *       201:
 *         description: Stock created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", stockController.createStock);

/**
 * @swagger
 * /api/stock/link:
 *   post:
 *     summary: Link a stock entry to a product
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stockId
 *               - productId
 *             properties:
 *               stockId:
 *                 type: string
 *                 example: uuid-for-stock
 *               productId:
 *                 type: string
 *                 example: uuid-for-product
 *     responses:
 *       200:
 *         description: Stock linked successfully
 *       400:
 *         description: Invalid input
 */
router.post("/link", stockController.linkStockToProduct);

/**
 * @swagger
 * /api/stock/place-order:
 *   post:
 *     summary: Place an order (move quantity to on-hold)
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variantId
 *               - quantity
 *             properties:
 *               variantId:
 *                 type: string
 *                 example: uuid-for-variant
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Order placed successfully
 *       400:
 *         description: Insufficient stock or invalid input
 */
router.post("/place-order", stockController.placeOrder);

/**
 * @swagger
 * /api/stock/cancel-order:
 *   post:
 *     summary: Cancel an order (move quantity back to available)
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variantId
 *               - quantity
 *             properties:
 *               variantId:
 *                 type: string
 *                 example: uuid-for-variant
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Insufficient on-hold stock or invalid input
 */
router.post("/cancel-order", stockController.cancelOrder);

/**
 * @swagger
 * /api/stock/fulfill-order:
 *   post:
 *     summary: Fulfill an order (move quantity to exhausted)
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variantId
 *               - quantity
 *             properties:
 *               variantId:
 *                 type: string
 *                 example: uuid-for-variant
 *               quantity:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Order fulfilled successfully
 *       400:
 *         description: Insufficient on-hold stock or invalid input
 */
router.post("/fulfill-order", stockController.fulfillOrder);

/**
 * @swagger
 * /api/stock/product/{productId}:
 *   get:
 *     summary: Get stock details by product ID
 *     tags: [Stock]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stock details retrieved
 *       404:
 *         description: Stock not found
 */
router.get("/product/:productId", stockController.getStockByProductId);


/**
 * @swagger
 * /api/stock/restock:
 *   post:
 *     summary: Restock a variant
 *     tags: [Stock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variantId
 *               - quantity
 *             properties:
 *               variantId:
 *                 type: string
 *                 example: uuid-for-variant
 *               quantity:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       200:
 *         description: Variant restocked successfully
 *       400:
 *         description: Invalid input
 */
router.post("/restock", stockController.restockVariant);

/**
 * @swagger
 * /api/stock:
 *   get:
 *     summary: List all stock entries
 *     tags: [Stock]
 *     responses:
 *       200:
 *         description: List of all stock entries
 */
router.get("/", stockController.getAllStocks);

module.exports = router;