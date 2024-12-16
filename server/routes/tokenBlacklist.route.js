const express = require("express");
const router = express.Router();
const tokenBlacklistController = require("../controllers/tokenBlacklist.controller");

/**
 * @swagger
 * tags:
 *   name: Token Blacklist
 *   description: API for managing blacklisted tokens
 */

/**
 * @swagger
 * /api/token-blacklist:
 *   post:
 *     summary: Add a token to the blacklist
 *     tags: [Token Blacklist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token to blacklist
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       201:
 *         description: Token blacklisted successfully
 */
router.post("/", tokenBlacklistController.create);

/**
 * @swagger
 * /api/token-blacklist:
 *   get:
 *     summary: Check if a token is blacklisted
 *     tags: [Token Blacklist]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The token to check
 *     responses:
 *       200:
 *         description: Token status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blacklisted:
 *                   type: boolean
 *                   description: Whether the token is blacklisted
 */
router.get("/", tokenBlacklistController.checkTokenBlacklist);

/**
 * @swagger
 * /api/token-blacklist:
 *   delete:
 *     summary: Remove a token from the blacklist
 *     tags: [Token Blacklist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token to remove from the blacklist
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token removed successfully
 *       404:
 *         description: Token not found in blacklist
 */
router.delete("/", tokenBlacklistController.removeTokenFromBlacklist);

/**
 * @swagger
 * /api/token-blacklist/all:
 *   get:
 *     summary: Get all blacklisted tokens
 *     tags: [Token Blacklist]
 *     responses:
 *       200:
 *         description: List of blacklisted tokens retrieved successfully
 */
router.get("/all", tokenBlacklistController.getAllBlacklistedTokens);

module.exports = router;
