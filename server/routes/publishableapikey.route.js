const express = require('express');
const router = express.Router();
const publishableApiKeyController = require('../controllers/publishableapikey.controller');

/**
 * @swagger
 * tags:
 *   name: PublishableApiKeys
 *   description: Manage publishable API keys
 */

/**
 * @swagger
 * /api/publishibleapikey:
 *   get:
 *     summary: List all publishable API keys
 *     tags: [PublishableApiKeys]
 *     responses:
 *       200:
 *         description: Returns a list of keys.
 */
router.get('/', publishableApiKeyController.list);

/**
 * @swagger
 * /api/publishibleapikey/{id}:
 *   get:
 *     summary: Retrieve a single publishable API key by ID
 *     tags: [PublishableApiKeys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: API Key details
 *       404:
 *         description: Key not found
 */
router.get('/:id', publishableApiKeyController.retrieve);

/**
 * @swagger
 * /api/publishibleapikey:
 *   post:
 *     summary: Create a new publishable API key
 *     tags: [PublishableApiKeys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', publishableApiKeyController.create);

/**
 * @swagger
 * /api/publishibleapikey/{id}:
 *   delete:
 *     summary: Delete a publishable API key
 *     tags: [PublishableApiKeys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Key not found
 */
router.delete('/:id', publishableApiKeyController.delete);

module.exports = router;
