// routes/transporterRoutes.js
const express = require("express");
const router = express.Router();
const { createTransporter, getAllTransporters, getTransporterById } = require("../controllers/transport.controller");
const validateRequest = require("../middleware/validateRequest");

/**
 * @swagger
 * /api/transporters:
 *   post:
 *     summary: Create a new transporter
 *     tags: [Transporters]
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
 *                 example: "XYZ Logistics"
 *               contact_info:
 *                 type: string
 *                 example: "+91-9876543211"
 *               gstin:
 *                 type: string
 *                 example: "22BBBBB0000B1Z5"
 *               address:
 *                 type: string
 *                 example: "456 Transporter Rd, Delhi"
 *     responses:
 *       201:
 *         description: Transporter created successfully
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.post("/", validateRequest(["name"]), createTransporter);

/**
 * @swagger
 * /api/transporters:
 *   get:
 *     summary: Get all transporters
 *     tags: [Transporters]
 *     responses:
 *       200:
 *         description: List of transporters retrieved successfully
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
 *                       transporter_id: { type: string, format: uuid }
 *                       name: { type: string }
 *                       contact_info: { type: string }
 *                       gstin: { type: string }
 *                       address: { type: string }
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllTransporters);

/**
 * @swagger
 * /api/transporters/{id}:
 *   get:
 *     summary: Get transporter by ID
 *     tags: [Transporters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Transporter UUID
 *     responses:
 *       200:
 *         description: Transporter retrieved successfully
 *       404:
 *         description: Transporter not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getTransporterById);

module.exports = router;