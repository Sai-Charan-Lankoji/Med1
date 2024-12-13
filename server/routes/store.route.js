const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');

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
router.post('/', storeController.createStore); // Create a store

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
router.get('/:id', storeController.getStore); // Get a store by ID

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
router.put('/:id', storeController.updateStore); // Update a store by ID

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
router.delete('/:id', storeController.deleteStore); // Delete a store by ID

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: List stores by vendor
 *     tags: [Stores]
 *     parameters:
 *       - in: query
 *         name: vendor_id
 *         schema:
 *           type: string
 *         required: false
 *         description: Vendor ID to filter stores
 *     responses:
 *       200:
 *         description: List of stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get('/', storeController.listStoresByVendor); // List stores by vendor (optional query param)

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: List stores
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: List of stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get('/', storeController.listStores); // List stores by vendor (optional query param)


module.exports = router;
