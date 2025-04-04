const express = require("express");
const router = express.Router();
const addressController = require("../controllers/customeraddress.controller");
const authMiddleware = require("../middleware/AuthMiddleware");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - customer_id
 *         - customer_email
 *         - first_name
 *         - last_name
 *         - phone_number
 *         - street
 *         - city
 *         - state
 *         - pincode
 *         - country
 *       properties:
 *         customer_id:
 *           type: string
 *           description: Unique ID of the customer
 *         customer_email:
 *           type: string
 *           format: email
 *           description: Email of the customer
 *         first_name:
 *           type: string
 *           description: First name of the customer
 *         last_name:
 *           type: string
 *           description: Last name of the customer
 *         phone_number:
 *           type: string
 *           description: Phone number of the customer (10-15 digits)
 *         street:
 *           type: string
 *           description: Street address
 *         landmark:
 *           type: string
 *           description: Landmark (optional)
 *         city:
 *           type: string
 *           description: City name
 *         state:
 *           type: string
 *           description: State name
 *         pincode:
 *           type: string
 *           description: Postal code (5-10 digits)
 *         country:
 *           type: string
 *           description: Country name
 *         address_type:
 *           type: string
 *           enum: [billing, shipping]
 *           description: Type of address (optional)
 *         is_default:
 *           type: boolean
 *           description: Whether this is the default address (optional)
 *         id:
 *           type: string
 *           description: Unique identifier of the address
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the address was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the address was last updated
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the address was deleted (soft delete)
 *       example:
 *         customer_id: "12345"
 *         customer_email: "user@example.com"
 *         first_name: "John"
 *         last_name: "Doe"
 *         phone_number: "1234567890"
 *         street: "123 Main St"
 *         landmark: "Near Central Park"
 *         city: "Hyderabad"
 *         state: "Telangana"
 *         pincode: "500001"
 *         country: "India"
 *         address_type: "billing"
 *         is_default: true
 *         id: "address_abc123"
 *         created_at: "2025-03-06T10:00:00Z"
 *         updated_at: null
 *         deleted_at: null
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
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
 *         status: 500
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
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *               example:
 *                 status: 201
 *                 success: true
 *                 message: "Address created successfully"
 *                 data:
 *                   customer_id: "12345"
 *                   customer_email: "user@example.com"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   phone_number: "1234567890"
 *                   street: "123 Main St"
 *                   landmark: "Near Central Park"
 *                   city: "Hyderabad"
 *                   state: "Telangana"
 *                   pincode: "500001"
 *                   country: "India"
 *                   address_type: "billing"
 *                   is_default: true
 *                   id: "address_abc123"
 *                   created_at: "2025-03-06T10:00:00Z"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: 400
 *               success: false
 *               message: "Invalid request parameters"
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 details: "All fields are required"
 *       409:
 *         description: Address already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: 409
 *               success: false
 *               message: "Address already exists"
 *               error:
 *                 code: "DUPLICATE_ADDRESS"
 *                 details: "This address is already registered for the customer"
 *       422:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: 422
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
router.post("/create", authMiddleware, addressController.createAddress);

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
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Address'
 *               example:
 *                 status: 200
 *                 success: true
 *                 message: "Customer addresses retrieved successfully"
 *                 data:
 *                   - customer_id: "12345"
 *                     customer_email: "user@example.com"
 *                     first_name: "John"
 *                     last_name: "Doe"
 *                     phone_number: "1234567890"
 *                     street: "123 Main St"
 *                     landmark: "Near Central Park"
 *                     city: "Hyderabad"
 *                     state: "Telangana"
 *                     pincode: "500001"
 *                     country: "India"
 *                     address_type: "billing"
 *                     is_default: true
 *                     id: "address_abc123"
 *                     created_at: "2025-03-06T10:00:00Z"
 *       400:
 *         description: Invalid customer ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: 400
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
 *               status: 404
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
router.get("/customer/:customerId", authMiddleware, addressController.getCustomerAddresses);

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
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *               example:
 *                 status: 200
 *                 success: true
 *                 message: "Address retrieved successfully"
 *                 data:
 *                   customer_id: "12345"
 *                   customer_email: "user@example.com"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   phone_number: "1234567890"
 *                   street: "123 Main St"
 *                   landmark: "Near Central Park"
 *                   city: "Hyderabad"
 *                   state: "Telangana"
 *                   pincode: "500001"
 *                   country: "India"
 *                   address_type: "billing"
 *                   is_default: true
 *                   id: "address_abc123"
 *                   created_at: "2025-03-06T10:00:00Z"
 *       400:
 *         description: Invalid address ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: 400
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
 *               status: 404
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
router.get("/:addressId", authMiddleware, addressController.getAddressById);

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
 *               first_name:
 *                 type: string
 *                 description: First name of the customer (optional)
 *               last_name:
 *                 type: string
 *                 description: Last name of the customer (optional)
 *               phone_number:
 *                 type: string
 *                 description: Phone number of the customer (optional, 10-15 digits)
 *               street:
 *                 type: string
 *                 description: Street address (optional)
 *               landmark:
 *                 type: string
 *                 description: Landmark (optional)
 *               city:
 *                 type: string
 *                 description: City name (optional)
 *               state:
 *                 type: string
 *                 description: State name (optional)
 *               pincode:
 *                 type: string
 *                 description: Postal code (optional, 5-10 digits)
 *               country:
 *                 type: string
 *                 description: Country name (optional)
 *               address_type:
 *                 type: string
 *                 enum: [billing, shipping]
 *                 description: Type of address (optional)
 *               is_default:
 *                 type: boolean
 *                 description: Whether this is the default address (optional)
 *             example:
 *               customer_email: "newuser@example.com"
 *               first_name: "Jane"
 *               last_name: "Doe"
 *               phone_number: "0987654321"
 *               street: "456 New St"
 *               landmark: "Near City Mall"
 *               city: "Bangalore"
 *               state: "Karnataka"
 *               pincode: "560001"
 *               country: "India"
 *               address_type: "shipping"
 *               is_default: false
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Address'
 *               example:
 *                 status: 200
 *                 success: true
 *                 message: "Address updated successfully"
 *                 data:
 *                   customer_id: "12345"
 *                   customer_email: "newuser@example.com"
 *                   first_name: "Jane"
 *                   last_name: "Doe"
 *                   phone_number: "0987654321"
 *                   street: "456 New St"
 *                   landmark: "Near City Mall"
 *                   city: "Bangalore"
 *                   state: "Karnataka"
 *                   pincode: "560001"
 *                   country: "India"
 *                   address_type: "shipping"
 *                   is_default: false
 *                   id: "address_abc123"
 *                   created_at: "2025-03-06T10:00:00Z"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: 400
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
 *               status: 422
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
 *               status: 404
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
router.put("/:addressId", authMiddleware, addressController.updateAddress);

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
 *                 status:
 *                   type: integer
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: null
 *               example:
 *                 status: 200
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
 *               status: 400
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
 *               status: 404
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
router.delete("/:addressId", authMiddleware, addressController.deleteAddress);

module.exports = router;