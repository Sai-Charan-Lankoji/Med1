// backend/routes/auth.route.js
const express = require('express');
const { signup, login, logout, getUsers,getCurrentUser } = require('../../controllers/auth.controller');
const validateRequest = require('../../middleware/validateRequest');
const authMiddleware = require('../../middleware/AuthMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Admin signup
 *     tags: [Auth]
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
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User created successfully, token set in cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 */
router.post('/signup', validateRequest(['email', 'first_name', 'last_name', 'password']), signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
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
 *         description: Login successful, token set in cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateRequest(['email', 'password']), login); 

router.get('/me', authMiddleware,getCurrentUser )

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Admin logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful, cookie cleared
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Token required
 */
router.post('/logout', authMiddleware, logout);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Fetch all users
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 total_pages:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/users', authMiddleware, getUsers);

module.exports = router;