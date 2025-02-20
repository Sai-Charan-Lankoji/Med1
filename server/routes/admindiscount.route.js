const express = require("express");
const DiscountController = require("../controllers/admindiscount.controller");

const router = express.Router();

/**
 * @swagger
 * /api/admin/discount:
 *   get:
 *     summary: Get discount settings
 *     tags: [Admin Discount]
 *     responses:
 *       200:
 *         description: Returns discount settings.
 */
router.get("/discount", DiscountController.getDiscount);

/**
 * @swagger
 * /api/admin/discount:
 *   post:
 *     summary: Create a new discount
 *     tags: [Admin Discount]
 *     parameters:
 *       - in: body
 *         name: discount
 *         description: Discount details to create
 *         schema:
 *           type: object
 *           properties:
 *             base_discount_threshold:
 *               type: number
 *               example: 120000
 *             high_discount_threshold:
 *               type: number
 *               example: 280000
 *             base_discount_rate:
 *               type: number
 *               example: 0.85
 *             high_discount_rate:
 *               type: number
 *               example: 0.75
 *     responses:
 *       '201':
 *         description: Discount created successfully
 */
router.post("/discount", DiscountController.createDiscount);

/**
 * @swagger
 * /api/admin/discount/{id}:
 *   put:
 *     summary: Update discount settings
 *     tags: [Admin Discount]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the discount to delete
 *         schema:
 *           type: string
 *       - in: body
 *         name: discount
 *         description: Discount settings object to update
 *         schema:
 *           type: object
 *           properties:
 *             base_discount_threshold:
 *               type: number
 *               example: 120000
 *             high_discount_threshold:
 *               type: number
 *               example: 280000
 *             base_discount_rate:
 *               type: number
 *               example: 0.85
 *             high_discount_rate:
 *               type: number
 *               example: 0.75
 *     responses:
 *       '200':
 *         description: Updated discount settings
 */
router.put("/discount", DiscountController.updateDiscount);

/**
 * @swagger
 * /api/admin/discount/{id}:
 *   delete:
 *     summary: Delete a specific discount
 *     tags: [Admin Discount]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the discount to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Discount deleted successfully
 *       '404':
 *         description: Discount not found
 */
router.delete("/discount/:id", DiscountController.deleteDiscount);

module.exports = router;