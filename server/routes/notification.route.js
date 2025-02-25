// notification.route.js
const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - vendor_id
 *         - type
 *         - message
 *         - status
 *       properties:
 *         id:
 *           type: string
 *         vendor_id:
 *           type: string
 *         invoice_id:
 *           type: string
 *         type:
 *           type: string
 *           enum: [email, push, sms, in-app]
 *         message:
 *           type: string
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *         sent_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', NotificationController.createNotification);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 */
router.get('/', NotificationController.getAllNotifications);

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get notification by ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification found
 *       404:
 *         description: Notification not found
 */
router.get('/:id', NotificationController.getNotificationById);

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     summary: Update notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       200:
 *         description: Notification updated
 *       400:
 *         description: Bad request
 */
router.put('/:id', NotificationController.updateNotification);

/**
 * @swagger
 * api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted
 *       400:
 *         description: Bad request
 */
router.delete('/:id', NotificationController.deleteNotification);

module.exports = router;