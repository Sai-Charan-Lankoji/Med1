const express = require("express");
const router = express.Router();
const vendorUserController = require("../controllers/vendoruser.controller");

/**
 * @swagger
 * /api/vendor-users:
 *   post:
 *     summary: Create a new VendorUser
 *     tags: [VendorUsers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorUser'
 *     responses:
 *       201:
 *         description: VendorUser created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/vendor-users", vendorUserController.createVendorUser);

/**
 * @swagger
 * /api/vendor-users/{id}:
 *   put:
 *     summary: Update a VendorUser by ID
 *     tags: [VendorUsers]
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
 *             $ref: '#/components/schemas/VendorUser'
 *     responses:
 *       200:
 *         description: VendorUser updated successfully
 *       404:
 *         description: VendorUser not found
 */
router.put("/vendor-users/:id", vendorUserController.updateVendorUser);

/**
 * @swagger
 * /api/vendor-users/{id}:
 *   get:
 *     summary: Get a VendorUser by ID
 *     tags: [VendorUsers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: VendorUser found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VendorUser'
 *       404:
 *         description: VendorUser not found
 */
router.get("/vendor-users/:id", vendorUserController.getVendorUser);

/**
 * @swagger
 * /api/vendor-users/{id}:
 *   delete:
 *     summary: Delete a VendorUser by ID
 *     tags: [VendorUsers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: VendorUser deleted successfully
 *       404:
 *         description: VendorUser not found
 */
router.delete("/vendor-users/:id", vendorUserController.deleteVendorUser);

/**
 * @swagger
 * /api/vendor-users/vendor/{vendorId}:
 *   get:
 *     summary: Get all VendorUsers by Vendor ID
 *     tags: [VendorUsers]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of VendorUsers for the vendor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VendorUser'
 *       404:
 *         description: Vendor not found or no users
 */
router.get("/vendor-users/vendor/:vendorId", vendorUserController.getUsersByVendor);

module.exports = router;
