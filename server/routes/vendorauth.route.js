const express = require("express");
const router = express.Router();
const vendorAuthController = require("../controllers/vendorauth.controller");

/**
 * @swagger
 * /api/vendor/login:
 *   post:
 *     summary: Login a vendor or vendor user and return a token
 *     tags: [VendorAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful, token returned
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", vendorAuthController.login);

/**
 * @swagger
 * /api/vendor/reset-password:
 *   post:
 *     summary: Reset a vendor's password
 *     tags: [VendorAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Invalid request or email not found
 */
router.post("/reset-password", vendorAuthController.resetPassword);

module.exports = router;
