// routes/supplierRoutes.js
const express = require("express");
const router = express.Router();
const { createSupplier, getAllSuppliers, getSupplierById } = require("../controllers/supplier.controller");
const validateRequest = require("../middleware/validateRequest"); // Placeholder middleware

/**
 * @swagger
 * /api/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "ABC Textiles"
 *               contact_info:
 *                 type: string
 *                 example: "+91-9876543210"
 *               gstin:
 *                 type: string
 *                 example: "22AAAAA0000A1Z5"
 *               address:
 *                 type: string
 *                 example: "123 Supplier St, Mumbai"
 *     responses:
 *       201:
 *         description: Supplier created successfully
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
 *                     supplier_id: { type: string, format: uuid }
 *                     name: { type: string }
 *                     contact_info: { type: string }
 *                     gstin: { type: string }
 *                     address: { type: string }
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 400 }
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Invalid request parameters" }
 *                 data: { type: null }
 *                 error: 
 *                   type: object
 *                   properties:
 *                     code: { type: string, example: "VALIDATION_ERROR" }
 *                     details: { type: string, example: "Name field is required" }
 *       500:
 *         description: Internal server error
 */
router.post("/", validateRequest(["name"]), createSupplier);

/**
 * @swagger
 * /api/suppliers:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: List of suppliers retrieved successfully
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
 *                       supplier_id: { type: string, format: uuid }
 *                       name: { type: string }
 *                       contact_info: { type: string }
 *                       gstin: { type: string }
 *                       address: { type: string }
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllSuppliers);

/**
 * @swagger
 * /api/suppliers/{id}:
 *   get:
 *     summary: Get supplier by ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Supplier UUID
 *     responses:
 *       200:
 *         description: Supplier retrieved successfully
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
 *                     supplier_id: { type: string, format: uuid }
 *                     name: { type: string }
 *                     contact_info: { type: string }
 *                     gstin: { type: string }
 *                     address: { type: string }
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getSupplierById);

module.exports = router;