const express = require("express");
const multer = require("multer");
const {
  signup,
  login,
  logout,
  getCurrentUser,
  getUsers,
  getCustomerDetails,
  customerByVendorId,
  getAllCustomers,
  getCustomerByEmail,
  updateCustomerDetails,
  changeCustomerPassword,
  resetCustomerPassword,
} = require("../controllers/customer.controller");
const authMiddleware = require("../middleware/AuthMiddleware");
const router = express.Router();
const upload = multer(); // Initialize Multer for parsing form-data

/**
 * @swagger
 * /api/customer/signup:
 *   post:
 *     summary: Customer signup
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *               - phone
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               first_name:
 *                 type: string
 *                 example: John
 *               last_name:
 *                 type: string
 *                 example: Doe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *               phone:
 *                 type: string
 *                 example: "9908798484"
 *               vendor_id:
 *                 type: string
 *                 example: vendor_123
 *     responses:
 *       201:
 *         description: Customer created successfully, token set in cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid input
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/customer/login:
 *   post:
 *     summary: Customer login
 *     tags: [Customers]
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
 *                 example: jayaramsai@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password
 *     responses:
 *       200:
 *         description: Login successful, token set in cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @swagger
 * /api/customer/me:
 *   get:
 *     summary: Get current authenticated customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current customer details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       401:
 *         description: Unauthorized - Token required or invalid
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.get("/me", authMiddleware, getCurrentUser);

/**
 * @swagger
 * /api/customer/logout:
 *   post:
 *     summary: Customer logout
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful, cookie cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful."
 *       400:
 *         description: Token is required for logout
 *       500:
 *         description: Server error
 */
router.post("/logout", authMiddleware, logout);

/**
 * @swagger
 * /api/customer/users:
 *   get:
 *     summary: Fetch all customers with pagination
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by role
 *         example: customer
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 total_pages:
 *                   type: integer
 *                   example: 10
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No customers found
 */
router.get("/users", authMiddleware, getUsers);

/**
 * @swagger
 * /api/customer:
 *   get:
 *     summary: Retrieve all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: List of all customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 customers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Server error
 */
router.get("/", getAllCustomers);

/**
 * @swagger
 * /api/customer/{id}:
 *   get:
 *     summary: Retrieve customer details by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the customer to retrieve
 *         example: customer_12345
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 */
router.get("/:id", getCustomerDetails);

/**
 * @swagger
 * /api/customer/vendor/{vendor_id}:
 *   get:
 *     summary: Retrieve customers by vendor ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: vendor_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Vendor ID to filter customers
 *         example: vendor_123
 *     responses:
 *       200:
 *         description: List of customers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       404:
 *         description: No customers found for the given vendor ID
 */
router.get("/vendor/:vendor_id", customerByVendorId);

/**
 * @swagger
 * /api/customer/{email}:
 *   get:
 *     summary: Retrieve customer details by email
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the customer to retrieve
 *         example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 */
router.get("/:email", getCustomerByEmail);
/**
 * @swagger
 * /customer/{id}:
 *   put:
 *     summary: Update customer profile
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               profile_photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Request successful
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Customer not found
 */
router.put("/:id", upload.single("profile_photo"), updateCustomerDetails);

/**
 * @swagger
 * /customer/{id}/change-password:
 *   put:
 *     summary: Change customer password
 *     tags: [Customer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Invalid old password
 *       404:
 *         description: Customer not found
 */
router.put("/:id/change-password", changeCustomerPassword);

/**
 * @swagger
 * /customer/reset-password:
 *   post:
 *     summary: Reset customer password
 *     tags: [Customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent to your email
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Customer not found
 */
router.post("/reset-password", resetCustomerPassword);

module.exports = router;