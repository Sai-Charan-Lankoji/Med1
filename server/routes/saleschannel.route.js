const express = require('express');
const router = express.Router();
const salesChannelController = require('../controllers/saleschannel.controller');

/**
 * @swagger
 * /api/saleschannels:
 *   post:
 *     summary: Create a new sales channel
 *     tags: [SalesChannels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalesChannel'
 *     responses:
 *       201:
 *         description: Sales channel created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', salesChannelController.createSalesChannel);

/**
 * @swagger
 * /api/saleschannels/{id}:
 *   get:
 *     summary: Get a sales channel by ID
 *     tags: [SalesChannels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sales channel found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesChannel'
 *       404:
 *         description: Sales channel not found
 */
router.get('/:id', salesChannelController.getSalesChannel);

/**
 * @swagger
 * /api/saleschannels/{id}:
 *   put:
 *     summary: Update a sales channel
 *     tags: [SalesChannels]
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
 *             $ref: '#/components/schemas/SalesChannel'
 *     responses:
 *       200:
 *         description: Sales channel updated successfully
 *       404:
 *         description: Sales channel not found
 */
router.put('/:id', salesChannelController.updateSalesChannel);

/**
 * @swagger
 * /api/saleschannels/{id}:
 *   delete:
 *     summary: Delete a sales channel
 *     tags: [SalesChannels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sales channel deleted successfully
 *       404:
 *         description: Sales channel not found
 */
router.delete('/:id', salesChannelController.deleteSalesChannel);

/**
 * @swagger
 * /api/saleschannels/vendor/{vendor_id}:
 *   get:
 *     summary: List sales channels by vendor ID
 *     tags: [SalesChannels]
 *     parameters:
 *       - in: path
 *         name: vendor_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of sales channels for the vendor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalesChannel'
 *       404:
 *         description: Vendor not found or no sales channels
 */
router.get('/vendor/:vendor_id', salesChannelController.listSalesChannelsByVendor);

module.exports = router;
