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
 * /api/vendors/analytics:
 *   get:
 *     summary: Retrieve commission breakdown for all vendors
 *     description: Returns analytics data including total vendors, total revenue, total admin commission, and monthly revenue across all vendors.
 *     tags: [ Vendors ]
 *     responses:
 *       200:
 *         description: Vendor commission breakdown retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Vendor commission breakdown retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_vendors:
 *                       type: integer
 *                       example: 150
 *                     total_orders:
 *                       type: integer
 *                       example: 500
 *                     commission_total_orders:
 *                       type: integer
 *                       example: 300
 *                     total_vendor_revenue:
 *                       type: string
 *                       example: "100000.00"
 *                     total_admin_commission:
 *                       type: string
 *                       example: "3000.00"
 *                     non_commissionable_revenue:
 *                       type: string
 *                       example: "5000.00"
 *                     final_vendor_revenue:
 *                       type: string
 *                       example: "102000.00"
 *                     monthly_revenue:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                             example: "Jan"
 *                           revenue:
 *                             type: string
 *                             example: "40000.00"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve vendor commission breakdown
 */
router.get("/analytics", vendorController.getVendorAnalytics);

/**
 * @swagger
 * /api/vendors/analytics/{vendorId}:
 *   get:
 *     summary: Retrieve store commission breakdown by vendor
 *     description: Returns store-level commission breakdown and monthly revenue for a specific vendor.
 *     tags: [ Vendors ]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the vendor
 *     responses:
 *       200:
 *         description: Store commission breakdown retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Store commission breakdown retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     vendor_id:
 *                       type: string
 *                       example: "vendor_123"
 *                     commission_rate:
 *                       type: string
 *                       example: "3%"
 *                     stores:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           store_id:
 *                             type: string
 *                             example: "store_123"
 *                           store_name:
 *                             type: string
 *                             example: "Store A"
 *                           total_revenue:
 *                             type: number
 *                             example: 50000
 *                           total_commission:
 *                             type: number
 *                             example: 1500
 *                           orders_count:
 *                             type: integer
 *                             example: 150
 *                     monthly_revenue:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                             example: "Jan"
 *                           revenue:
 *                             type: string
 *                             example: "40000.00"
 *       400:
 *         description: Invalid vendor ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid or missing vendorId
 *                 data:
 *                   type: null
 *                   example: null
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Vendor not found
 *                 data:
 *                   type: null
 *                   example: null
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve store commission breakdown
 */
router.get(
  "/analytics/:vendorId",
  vendorController.getStoreCommissionBreakdownByVendor
);
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
