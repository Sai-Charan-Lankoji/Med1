const express = require("express");
const router = express.Router();
const storeController = require("../controllers/store.controller");

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: List all stores
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: List of all stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get("/", storeController.listStores);

/**
 * @swagger
 * /api/stores/add-domain:
 *   post:
 *     summary: Create a new store with domain
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeName
 *             properties:
 *               storeName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vercel domain created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/add-domain", storeController.addDomain);

/**
 * @swagger
 * /api/stores/url/{store_url}:
 *   get:
 *     summary: Fetch a store by its store_url
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: store_url
 *         schema:
 *           type: string
 *         required: true
 *         description: The URL of the store
 *     responses:
 *       200:
 *         description: The store details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 store_url:
 *                   type: string
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Server error
 */
router.get("/url/:store_url", storeController.getStoreByUrl);

/**
 * @swagger
 * /api/stores/vendor:
 *   get:
 *     summary: Retrieve a list of stores by vendor
 *     description: Returns all stores associated with a specific vendor ID. If no vendor_id is provided, an error will be returned.
 *     tags: [Stores]
 *     parameters:
 *       - in: query
 *         name: vendor_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The unique identifier of the vendor to filter stores by
 *     responses:
 *       200:
 *         description: Successfully retrieved list of stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 *       400:
 *         description: Bad request - Invalid or missing vendor_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Vendor ID is required"
 *                 name:
 *                   type: string
 *                   example: "Error"
 *                 stack:
 *                   type: string
 *                   example: "Error stack trace (development only)"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch stores: database error"
 */
router.get("/vendor", storeController.listStoresByVendor);

/**
 * @swagger
 * /api/stores/{id}:
 *   get:
 *     summary: Get a store by ID
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Store not found
 */
router.get("/:id", storeController.getStore);

/**
 * @swagger
 * /api/stores/{id}:
 *   put:
 *     summary: Update a store
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               store_type:
 *                 type: string
 *               publishableapikey:
 *                 type: string
 *               store_url:
 *                 type: string
 *               vendor_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       404:
 *         description: Store not found
 */
router.put("/:id", storeController.updateStore);

/**
 * @swagger
 * /api/stores/{id}:
 *   delete:
 *     summary: Delete a store
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Store deleted successfully
 *       404:
 *         description: Store not found
 */
router.delete("/:id", storeController.deleteStore);

/**
 * @swagger
 * /api/stores:
 *   post:
 *     summary: Create a new store
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - store_type
 *               - vendor_id
 *             properties:
 *               store_type:
 *                 type: string
 *               publishableapikey:
 *                 type: string
 *               store_url:
 *                 type: string
 *               vendor_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Store created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", storeController.createStore);

module.exports = router;