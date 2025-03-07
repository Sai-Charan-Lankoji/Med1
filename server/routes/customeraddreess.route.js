const express = require('express');
const router = express.Router();
const addressController = require('../controllers/customeraddress.controller');

/**
 * @swagger
 * /api/address/create:
 *   post:
 *     summary: Create a new customer address
 *     tags: [CustomerAddress]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customer_id
 *               - customer_email
 *               - street
 *               - city
 *               - state
 *               - pincode
 *             properties:
 *               customer_id:
 *                 type: string
 *                 description: Unique ID of the customer
 *               customer_email:
 *                 type: string
 *                 description: Email of the customer
 *               street:
 *                 type: string
 *                 description: Street address
 *               city:
 *                 type: string
 *                 description: City name
 *               state:
 *                 type: string
 *                 description: State name
 *               pincode:
 *                 type: string
 *                 description: Postal code
 *             example:
 *               customer_id: "12345"
 *               customer_email: "user@example.com"
 *               street: "123 Main St"
 *               city: "Hyderabad"
 *               state: "Telangana"
 *               pincode: "500001"
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     customer_id:
 *                       type: string
 *                     customer_email:
 *                       type: string
 *                     street:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     pincode:
 *                       type: string
 *                     _id:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *             example:
 *               message: "Address created successfully"
 *               data:
 *                 customer_id: "12345"
 *                 customer_email: "user@example.com"
 *                 street: "123 Main St"
 *                 city: "Hyderabad"
 *                 state: "Telangana"
 *                 pincode: "500001"
 *                 _id: "some-id"
 *                 created_at: "2025-03-06T10:00:00Z"
 *       500:
 *         description: Error creating address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             example:
 *               message: "Error creating address"
 *               error: "Some error message"
 */
router.post('/create', addressController.createAddress);


/**
 * @swagger
 * /api/address/{id}:
 *   get:
 *     summary: Get customer addresses by ID
 *     tags: [CustomerAddress]
 *     parameters:
 *       - in: path
 *         name: id
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
 *                     type: object
 *                     properties:
 *                       customer_id:
 *                         type: string
 *                       customer_email:
 *                         type: string
 *                       street:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       pincode:
 *                         type: string
 *                       _id:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *             example:
 *               success: true
 *               message: "Customer addresses retrieved successfully"
 *               data:
 *                 - customer_id: "12345"
 *                   customer_email: "user@example.com"
 *                   street: "123 Main St"
 *                   city: "Hyderabad"
 *                   state: "Telangana"
 *                   pincode: "500001"
 *                   _id: "some-id"
 *                   created_at: "2025-03-06T10:00:00Z"
 *                 - customer_id: "12345"
 *                   customer_email: "user@example.com"
 *                   street: "456 Another St"
 *                   city: "Hyderabad"
 *                   state: "Telangana"
 *                   pincode: "500002"
 *                   _id: "another-id"
 *                   created_at: "2025-03-07T10:00:00Z"
 *       404:
 *         description: Customer addresses not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             example:
 *               success: false
 *               message: "Customer addresses not found"
 *               error: "No addresses found for the given customer ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 *               error: "An unexpected error occurred"
 */
router.get('/:id', addressController.getCustomerAddresses);

module.exports = router;