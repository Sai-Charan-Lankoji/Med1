const express = require("express");
const standardProductController = require("../controllers/standardProduct.controller");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
  { name: "front_image", maxCount: 1 },
  { name: "back_image", maxCount: 1 },
  { name: "left_image", maxCount: 1 },
  { name: "right_image", maxCount: 1 },
]);

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: StandardProducts
 *   description: API for managing standard products
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new standard product (with image uploads)
 *     tags: [StandardProducts]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - category
 *               - stock
 *               - sku
 *             properties:
 *               title:
 *                 type: string
 *                 description: Product title
 *                 example: Premium Cotton T-Shirt
 *               description:
 *                 type: string
 *                 description: Product description
 *                 example: High-quality cotton t-shirt with premium stitching
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Product price
 *                 example: 29.99
 *               category:
 *                 type: string
 *                 enum: [Clothing, Shoes, Accessories, Electronics, Home]
 *                 description: Product category
 *                 example: Clothing
 *               sizes:
 *                 type: string
 *                 description: Comma-separated list of available sizes (convert to array in backend)
 *                 example: XS,S,M,L,XL
 *               colors:
 *                 type: string
 *                 description: JSON string of available colors (convert to array in backend)
 *                 example: '[{"name":"Navy Blue","hex":"#000080","inStock":true},{"name":"Charcoal Grey","hex":"#36454F","inStock":true}]'
 *               stock:
 *                 type: integer
 *                 description: Stock quantity
 *                 example: 100
 *               brand:
 *                 type: string
 *                 description: Product brand
 *                 example: EcoWear
 *               sku:
 *                 type: string
 *                 description: Stock Keeping Unit (unique identifier)
 *                 example: ECO-TS-001
 *               weight:
 *                 type: number
 *                 format: float
 *                 description: Product weight
 *                 example: 0.3
 *               dimensions:
 *                 type: string
 *                 description: JSON string of product dimensions (convert to object in backend)
 *                 example: '{"length":28,"width":20,"height":2}'
 *               is_customizable:
 *                 type: boolean
 *                 description: Whether the product is customizable
 *                 example: true
 *               is_discountable:
 *                 type: boolean
 *                 description: Whether the product is discountable
 *                 example: false
 *               front_image:
 *                 type: string
 *                 format: binary
 *                 description: Upload front view of the product
 *               back_image:
 *                 type: string
 *                 format: binary
 *                 description: Upload back view of the product
 *               left_image:
 *                 type: string
 *                 format: binary
 *                 description: Upload left view of the product
 *               right_image:
 *                 type: string
 *                 format: binary
 *                 description: Upload right view of the product
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", upload, standardProductController.createStandardProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List all standard products
 *     tags: [StandardProducts]
 *     responses:
 *       200:
 *         description: List of all standard products
 */
router.get("/", standardProductController.getAllStandardProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a standard product by ID
 *     tags: [StandardProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", standardProductController.getStandardProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a standard product by ID (including image uploads)
 *     tags: [StandardProducts]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               sizes:
 *                 type: string
 *               stock:
 *                 type: integer
 *               brand:
 *                 type: string
 *               sku:
 *                 type: string
 *               weight:
 *                 type: number
 *               dimensions:
 *                 type: string
 *               is_customizable:
 *                 type: boolean
 *               is_discountable:
 *                 type: boolean
 *               front_image:
 *                 type: string
 *                 format: binary
 *               back_image:
 *                 type: string
 *                 format: binary
 *               left_image:
 *                 type: string
 *                 format: binary
 *               right_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
router.put("/:id", upload, standardProductController.updateStandardProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a standard product by ID (including images)
 *     tags: [StandardProducts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/:id", standardProductController.deleteStandardProduct);

module.exports = router;
