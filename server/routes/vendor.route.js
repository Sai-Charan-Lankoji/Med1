const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendor.controller");

/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: Vendor management APIs
 */

/**
 * @swagger
 * /api/vendors:
 *   get:
 *     summary: Retrieve all vendors
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: List of all vendors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vendor'
 */
router.get("/", vendorController.getAllVendors);

/**
 * @swagger
 * /api/vendors/{id}:
 *   get:
 *     summary: Get a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: vendor_12345678
 *     responses:
 *       200:
 *         description: Vendor found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vendor'
 *       404:
 *         description: Vendor not found
 */
router.get("/:id", vendorController.getVendorById);

/**
 * @swagger
 * /api/vendors:
 *   post:
 *     summary: Create a new vendor
 *     tags: [Vendors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorRequest'
 *     responses:
 *       201:
 *         description: Vendor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/openapi/schemas/vendor'
 *       400:
 *         description: Invalid input
 */
router.post("/", vendorController.createVendor);

/**
 * @swagger
 * /api/vendors/{id}:
 *   put:
 *     summary: Update a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: vendor_12345678
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorRequest'
 *     responses:
 *       200:
 *         description: Vendor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vendor'
 *       404:
 *         description: Vendor not found
 */
router.put("/:id", vendorController.updateVendor);

/**
 * @swagger
 * /api/vendors/{id}:
 *   delete:
 *     summary: Delete a vendor by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: vendor_12345678
 *     responses:
 *       200:
 *         description: Vendor deleted successfully
 *       404:
 *         description: Vendor not found
 */
router.delete("/:id", vendorController.deleteVendor);

module.exports = router;
