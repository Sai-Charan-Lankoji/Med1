const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stock.controller");

/**
 * @swagger
 * /api/stock:
 *   get:
 *     summary: Get all stock entries
 *     tags: [Stocks]
 *     responses:
 *       200:
 *         description: List of all stock entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stocks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Stock'
 *       400:
 *         description: Error fetching stocks
 */
router.get("/", stockController.getAllStocks);

/**
 * @swagger
 * /api/stock:
 *   post:
 *     summary: Create a new stock entry
 *     tags: [Stocks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - stockType
 *               - hsnCode
 *               - gstPercentage
 *               - variants
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               stockType:
 *                 type: string
 *                 enum: [Standard, Designable]
 *               productId:
 *                 type: string
 *               hsnCode:
 *                 type: string
 *               gstPercentage:
 *                 type: number
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                     color:
 *                       type: string
 *                     totalQuantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Stock created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stock:
 *                   $ref: '#/components/schemas/Stock'
 *       400:
 *         description: Invalid input
 */
router.post("/", stockController.createStock);

/**
 * @swagger
 * /api/stock/{productId}:
 *   get:
 *     summary: Get stock by product ID
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product to fetch stock for
 *     responses:
 *       200:
 *         description: Stock found for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stock:
 *                   $ref: '#/components/schemas/Stock'
 *       400:
 *         description: Invalid or missing productId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "productId is required"
 *       404:
 *         description: Stock not found for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Stock not found for productId: <productId>"
 */
router.get("/:productId", stockController.getStockByProductId);

/**
 * @swagger
 * /api/stock/variant/{variantId}:
 *   get:
 *     summary: Get a stock variant by ID
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the stock variant to retrieve
 *     responses:
 *       200:
 *         description: Stock variant retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Stock variant retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     variantId:
 *                       type: string
 *                       format: uuid
 *                     stockId:
 *                       type: string
 *                       format: uuid
 *                     size:
 *                       type: string
 *                     color:
 *                       type: string
 *                     totalQuantity:
 *                       type: integer
 *                     availableQuantity:
 *                       type: integer
 *                     onHoldQuantity:
 *                       type: integer
 *                     exhaustedQuantity:
 *                       type: integer
 *                     stock:
 *                       type: object
 *                       properties:
 *                         stock_id:
 *                           type: string
 *                           format: uuid
 *                         hsnCode:
 *                           type: string
 *                         gstPercentage:
 *                           type: number
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Variant ID is required"
 *       404:
 *         description: Stock variant not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Stock variant not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch stock variant: ..."
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     details:
 *                       type: string
 */
router.get("/variant/:variantId", stockController.getStockVariantById);

/**
 * @swagger
 * /api/stock/place-order:
 *   post:
 *     summary: Place an order (move to on-hold)
 *     tags: [Stocks]
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
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order placed successfully
 *       400:
 *         description: Invalid input
 */
router.post("/place-order", stockController.placeOrder);

/**
 * @swagger
 * /api/stock/cancel-order:
 *   post:
 *     summary: Cancel an order (move back to available)
 *     tags: [Stocks]
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
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Invalid input
 */
router.post("/cancel-order", stockController.cancelOrder);

/**
 * @swagger
 * /api/stock/fulfill-order:
 *   post:
 *     summary: Fulfill an order (move to exhausted)
 *     tags: [Stocks]
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
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order fulfilled successfully
 *       400:
 *         description: Invalid input
 */
router.post("/fulfill-order", stockController.fulfillOrder);

/**
 * @swagger
 * /api/stock/restock:
 *   post:
 *     summary: Restock a variant
 *     tags: [Stocks]
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
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Variant restocked successfully
 *       400:
 *         description: Invalid input
 */
router.post("/restock", stockController.restockVariant);

/**
 * @swagger
 * /api/stock/vendor/{vendorId}:
 *   get:
 *     summary: Get all stocks by vendor ID
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the vendor to fetch stocks for
 *     responses:
 *       200:
 *         description: List of stocks for the vendor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 stocks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Stock'
 *       400:
 *         description: Invalid or missing vendorId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Vendor ID is required"
 *       500:
 *         description: Internal server error
 */
router.get("/vendor/:vendorId", stockController.getStocksByVendorId);

module.exports = router;
