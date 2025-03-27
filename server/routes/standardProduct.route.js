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
 * /api/standardproducts:
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
 *                 example: Premium Cotton T-Shirt
 *               description:
 *                 type: string
 *                 example: High-quality cotton t-shirt
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 29.99
 *               category:
 *                 type: string
 *                 enum: [Clothing, Shoes, Accessories, Electronics, Home]
 *                 example: Clothing
 *               sizes:
 *                 type: string
 *                 example: XS,S,M,L,XL
 *               colors:
 *                 type: string
 *                 example: '[{"name":"Navy Blue","hex":"#000080","inStock":true}]'
 *               stock:
 *                 type: integer
 *                 example: 100
 *               brand:
 *                 type: string
 *                 example: EcoWear
 *               sku:
 *                 type: string
 *                 example: ECO-TS-001
 *               weight:
 *                 type: number
 *                 format: float
 *                 example: 0.3
 *               dimensions:
 *                 type: string
 *                 example: '{"length":28,"width":20,"height":2}'
 *               is_customizable:
 *                 type: boolean
 *                 example: true
 *               is_discountable:
 *                 type: boolean
 *                 example: false
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
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", upload, standardProductController.createStandardProduct);

/**
 * @swagger
 * /api/standardproducts:
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
 * /api/standardproducts/store/{storeId}:
 *   get:
 *     summary: List all standard products by storeId
 *     tags: [StandardProducts]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products found
 *       404:
 *         description: No products found
 */
router.get("/store/:storeId", standardProductController.getAllStandardProductsByStoreId);

/**
 * @swagger
 * /api/standardproducts/vendor/{vendorId}:
 *   get:
 *     summary: List all standard products by vendorId
 *     tags: [StandardProducts]
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products found
 *       404:
 *         description: No products found
 */
router.get("/vendor/:vendorId", standardProductController.getAllStandardProductsByVendorId);

/**
 * @swagger
 * /api/standardproducts/{id}:
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
 * /api/standardproducts/{id}:
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
 * /api/standardproducts/{id}:
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
