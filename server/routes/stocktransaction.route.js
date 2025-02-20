// routes/stockTransactionRoutes.js
const express = require("express");
const router = express.Router();
const { getStockTransactionsByProduct } = require("../controllers/stocktransaction.controller");

/**
 * @swagger
 * /api/stock-transactions/{product_id}:
 *   get:
 *     summary: Get stock transactions for a product
 *     tags: [StockTransactions]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product UUID
 *     responses:
 *       200:
 *         description: Stock transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Request successful" }
 *                 data: 
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       transaction_id: { type: string, format: uuid }
 *                       product_id: { type: string, format: uuid }
 *                       size: { type: string }
 *                       color: { type: string }
 *                       quantity: { type: integer }
 *                       purchased_price: { type: number }
 *                       selling_price: { type: number }
 *                       date: { type: string, format: date }
 *                       type: { type: string }
 *                       reference: { type: string }
 *       500:
 *         description: Internal server error
 */
router.get("/:product_id", getStockTransactionsByProduct);

module.exports = router;