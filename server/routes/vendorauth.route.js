const express = require("express");
const router = express.Router();
const vendorAuthController = require("../controllers/vendorauth.controller");
const authMiddleware = require("../middleware/AuthMiddleware"); // Assuming this exists

/**
 * @swagger
 * /api/vendor/login:
 *   post:
 *     summary: Login a vendor or vendor user
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
 *                 example: "vendor@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Login successful, sets auth_token cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     vendor:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", vendorAuthController.login);

/**
 * @swagger
 * /api/vendor/me:
 *   get:
 *     summary: Get current authenticated vendor details
 *     tags: [VendorAuth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Vendor details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Vendor retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     vendor:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *       401:
 *         description: Unauthorized - Token required or invalid
 *       404:
 *         description: Vendor not found
 */
router.get("/me", authMiddleware, vendorAuthController.getCurrentVendor);

/**
 * @swagger
 * /api/vendor/send-reset-link:
 *   post:
 *     summary: Send a password reset link to the vendor's email
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
 *                 example: "vendor@example.com"
 *     responses:
 *       200:
 *         description: Reset link sent successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Email not found
 */
router.post("/send-reset-link", vendorAuthController.sendResetLink);

/**
 * @swagger
 * /api/vendor/reset-password:
 *   post:
 *     summary: Reset a vendor's password using a token
 *     tags: [VendorAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token or request
 *       404:
 *         description: Email not found
 */
router.post("/reset-password", vendorAuthController.resetPassword);

/**
 * @swagger
 * /api/vendor/logout:
 *   post:
 *     summary: Logout a vendor by blacklisting their token
 *     tags: [VendorAuth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       400:
 *         description: Token is required for logout
 *       500:
 *         description: Server error
 */
router.post("/logout", authMiddleware, vendorAuthController.logout);

module.exports = router;