const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const authMiddleware = require("../middleware/AuthMiddleware"); // Your auth middleware

/**
 * @swagger
 * /api/wishlists/add:
 *   post:
 *     summary: Add a product to the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []  # Assuming JWT-based auth via authMiddleware
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the product to add (optional if standard_product_id is provided)
 *               standard_product_id:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the standard product to add (optional if product_id is provided)
 *             example:
 *               product_id: "550e8400-e29b-41d4-a716-446655440000"
 *               standard_product_id: null
 *     responses:
 *       201:
 *         description: Item added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { type: object }
 *       400:
 *         description: Bad request (e.g., missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 error: { type: string }
 *                 message: { type: string }
 *       409:
 *         description: Conflict (item already in wishlist)
 *       500:
 *         description: Server error
 */
router.post("/add", authMiddleware, wishlistController.addToWishlist);

/**
 * @swagger
 * /api/wishlists/remove:
 *   delete:
 *     summary: Remove a product from the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []  # Assuming JWT-based auth via authMiddleware
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the product to remove (optional if standard_product_id is provided)
 *               standard_product_id:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the standard product to remove (optional if product_id is provided)
 *             example:
 *               product_id: "550e8400-e29b-41d4-a716-446655440000"
 *               standard_product_id: null
 *     responses:
 *       200:
 *         description: Item removed from wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *       400:
 *         description: Bad request (e.g., missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 error: { type: string }
 *                 message: { type: string }
 *       404:
 *         description: Item not found in wishlist
 *       500:
 *         description: Server error
 */
router.delete("/remove", authMiddleware, wishlistController.removeFromWishlist);

/**
 * @swagger
 * /api/wishlists:
 *   get:
 *     summary: Get all wishlist items for the logged-in user
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []  # Assuming JWT-based auth via authMiddleware
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, format: uuid }
 *                       customer_id: { type: string, format: uuid }
 *                       product_id: { type: string, format: uuid }
 *                       standard_product_id: { type: string, format: uuid }
 *                       product: { type: object }
 *                       standardProduct: { type: object }
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 error: { type: string }
 *                 message: { type: string }
 */
router.get("/", authMiddleware, wishlistController.getWishlistByUser);

module.exports = router;