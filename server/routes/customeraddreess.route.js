const express = require('express');
const router = express.Router();
const addressController = require('../controllers/customeraddress.controller');
const authMiddleware = require('../middleware/AuthMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - customer_id
 *         - customer_email
 *         - street
 *         - city
 *         - state
 *         - pincode
 *       properties:
 *         customer_id:
 *           type: string
 *           description: Unique ID of the customer
 *         customer_email:
 *           type: string
 *           description: Email of the customer
 *           format: email
 *         street:
 *           type: string
 *           description: Street address
 *         city:
 *           type: string
 *           description: City name
 *         state:
 *           type: string
 *           description: State name
 *         pincode:
 *           type: string
 *           description: Postal code (5-10 digits)
 *         _id:
 *           type: string
 *           description: Unique identifier of the address
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the address was created
 *       example:
 *         customer_id: "12345"
 *         customer_email: "user@example.com"
 *         street: "123 Main St"
 *         city: "Hyderabad"
 *         state: "Telangana"
 *         pincode: "500001"
 *         _id: "some-id"
 *         created_at: "2025-03-06T10:00:00Z"
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *             details:
 *               type: string
 *       example:
 *         success: false
 *         message: "Internal Server Error"
 *         error:
 *           code: "SERVER_ERROR"
 *           details: "An unexpected error occurred"
 */

/**
 * @swagger
 * /api/address/create:
 *   post:
 *     summary: Create a new customer address
 *     tags: [CustomerAddress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *               example:
 *                 success: true
 *                 message: "Address created successfully"
 *                 data:
 *                   customer_id: "12345"
 *                   customer_email: "user@example.com"
 *                   street: "123 Main St"
 *                   city: "Hyderabad"
 *                   state: "Telangana"
 *                   pincode: "500001"
 *                   _id: "some-id"
 *                   created_at: "2025-03-06T10:00:00Z"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid request parameters"
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 details: "All fields are required"
 *       422:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid input"
 *               error:
 *                 code: "INVALID_DATA"
 *                 details: "Customer email is not in a valid format"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/create', authMiddleware, addressController.createAddress);

/**
 * @swagger
 * /api/address/customer/{customerId}:
 *   get:
 *     summary: Get all addresses for a customer
 *     tags: [CustomerAddress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the customer
 *     responses:
 *       200:
 *         description: Customer addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *               example:
 *                 success: true
 *                 message: "Customer addresses retrieved successfully"
 *                 data:
 *                   - customer_id: "12345"
 *                     customer_email: "user@example.com"
 *                     street: "123 Main St"
 *                     city: "Hyderabad"
 *                     state: "Telangana"
 *                     pincode: "500001"
 *                     _id: "some-id"
 *                     created_at: "2025-03-06T10:00:00Z"
 *       400:
 *         description: Invalid customer ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid request parameters"
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 details: "Customer ID is required"
 *       404:
 *         description: No addresses found for the customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Customer addresses not found"
 *               error:
 *                 code: "NOT_FOUND"
 *                 details: "No addresses found for the given customer ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/customer/:customerId', authMiddleware, addressController.getCustomerAddresses);

/**
 * @swagger
 * /api/address/{addressId}:
 *   get:
 *     summary: Get a specific address by ID
 *     tags: [CustomerAddress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the address
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *               example:
 *                 success: true
 *                 message: "Address retrieved successfully"
 *                 data:
 *                   customer_id: "12345"
 *                   customer_email: "user@example.com"
 *                   street: "123 Main St"
 *                   city: "Hyderabad"
 *                   state: "Telangana"
 *                   pincode: "500001"
 *                   _id: "some-id"
 *                   created_at: "2025-03-06T10:00:00Z"
 *       400:
 *         description: Invalid address ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid request parameters"
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 details: "Address ID is required"
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Address not found"
 *               error:
 *                 code: "NOT_FOUND"
 *                 details: "No address found with the given ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:addressId', authMiddleware, addressController.getAddressById);

/**
 * @swagger
 * /api/address/{addressId}:
 *   put:
 *     summary: Update an existing customer address
 *     tags: [CustomerAddress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the address to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_email:
 *                 type: string
 *                 format: email
 *                 description: Email of the customer (optional)
 *               street:
 *                 type: string
 *                 description: Street address (optional)
 *               city:
 *                 type: string
 *                 description: City name (optional)
 *               state:
 *                 type: string
 *                 description: State name (optional)
 *               pincode:
 *                 type: string
 *                 description: Postal code (optional, 5-10 digits)
 *             example:
 *               customer_email: "newuser@example.com"
 *               street: "456 New St"
 *               city: "Bangalore"
 *               state: "Karnataka"
 *               pincode: "560001"
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *               example:
 *                 success: true
 *                 message: "Address updated successfully"
 *                 data:
 *                   customer_id: "12345"
 *                   customer_email: "newuser@example.com"
 *                   street: "456 New St"
 *                   city: "Bangalore"
 *                   state: "Karnataka"
 *                   pincode: "560001"
 *                   _id: "some-id"
 *                   created_at: "2025-03-06T10:00:00Z"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid request parameters"
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 details: "Address ID is required"
 *       422:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid input"
 *               error:
 *                 code: "INVALID_DATA"
 *                 details: "Pincode must be 5-10 digits"
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Address not found"
 *               error:
 *                 code: "NOT_FOUND"
 *                 details: "No address found with the given ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:addressId', authMiddleware, addressController.updateAddress);

/**
 * @swagger
 * /api/address/{addressId}:
 *   delete:
 *     summary: Delete a customer address
 *     tags: [CustomerAddress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the address to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *               example:
 *                 success: true
 *                 message: "Address deleted successfully"
 *                 data: null
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Invalid request parameters"
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 details: "Address ID is required"
 *       404:
 *         description: Address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Address not found"
 *               error:
 *                 code: "NOT_FOUND"
 *                 details: "No address found with the given ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:addressId', authMiddleware, addressController.deleteAddress);

module.exports = router;