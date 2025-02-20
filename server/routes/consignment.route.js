// routes/consignmentRoutes.js
const express = require("express");
const router = express.Router();
const { createConsignment, getConsignmentByNumber } = require("../controllers/consignment.controller");
const validateRequest = require("../middleware/validateRequest");

/**
 * @swagger
 * /api/consignments:
 *   post:
 *     summary: Create a new consignment and update stock
 *     tags: [Consignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consignment_number
 *               - supplier_id
 *               - transporter_id
 *               - date
 *               - items
 *             properties:
 *               consignment_number:
 *                 type: string
 *                 example: "C123"
 *               supplier_id:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               transporter_id:
 *                 type: string
 *                 format: uuid
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-20"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - quantity
 *                     - purchased_price
 *                     - selling_price
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440002"
 *                     size:
 *                       type: string
 *                       example: "M"
 *                     color:
 *                       type: string
 *                       example: "Red"
 *                     quantity:
 *                       type: integer
 *                       example: 10
 *                     purchased_price:
 *                       type: number
 *                       example: 10.00
 *                     selling_price:
 *                       type: number
 *                       example: 15.00
 *     responses:
 *       201:
 *         description: Consignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 201 }
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Resource created successfully" }
 *                 data: 
 *                   type: object
 *                   properties:
 *                     consignment_number: { type: string }
 *                     supplier_id: { type: string, format: uuid }
 *                     transporter_id: { type: string, format: uuid }
 *                     date: { type: string, format: date }
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           consignment_detail_id: { type: string, format: uuid }
 *                           product_id: { type: string, format: uuid }
 *                           size: { type: string }
 *                           color: { type: string }
 *                           quantity: { type: integer }
 *       400:
 *         description: Invalid request parameters
 *       409:
 *         description: Consignment number already exists
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  validateRequest(["consignment_number", "supplier_id", "transporter_id", "date", "items"]),
  createConsignment
);

/**
 * @swagger
 * /api/consignments/{number}:
 *   get:
 *     summary: Get consignment by number
 *     tags: [Consignments]
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: string
 *         description: Consignment number
 *     responses:
 *       200:
 *         description: Consignment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Request successful" }
 *                 data: 
 *                   type: object
 *                   properties:
 *                     consignment_number: { type: string }
 *                     supplier_id: { type: string, format: uuid }
 *                     transporter_id: { type: string, format: uuid }
 *                     date: { type: string, format: date }
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           consignment_detail_id: { type: string, format: uuid }
 *                           product_id: { type: string, format: uuid }
 *                           size: { type: string }
 *                           color: { type: string }
 *                           quantity: { type: integer }
 *       404:
 *         description: Consignment not found
 *       500:
 *         description: Internal server error
 */
router.get("/:number", getConsignmentByNumber);

module.exports = router;