// notification.controller.js
const NotificationService = require("../services/notification.service");

class NotificationController {
  async createNotification(req, res) {
    try {
      const notification = await NotificationService.createNotification(
        req.body
      );
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllNotifications(req, res) {
    try {
      const notifications = await NotificationService.getAllNotifications();
      res.status(200).json(notifications);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getNotificationById(req, res) {
    try {
      const notification = await NotificationService.getNotificationById(
        req.params.id
      );
      res.status(200).json(notification);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Example usage in controller
  async updateNotification(req, res) {
    try {
      const notification = await NotificationService.updateNotification(
        req.params.id,
        req.body
      );
      res.status(200).json({
        success: true,
        data: notification,
        message: "Notification updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async deleteNotification(req, res) {
    try {
      const result = await NotificationService.deleteNotification(
        req.params.id
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new NotificationController();
