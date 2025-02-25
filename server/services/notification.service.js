// notification.service.js
const Notification = require("../models/notification.model");
const Vendor = require("../models/vendor.model");
const Invoice = require("../models/invoice.model");

class NotificationService {
  async createNotification(data) {
    try {
      const notification = await Notification.create(data);
      return notification;
    } catch (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  }

  async getAllNotifications() {
    try {
      const notifications = await Notification.findAll({});
      return notifications;
    } catch (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
  }

  async getNotificationById(id) {
    try {
      const notification = await Notification.findByPk(id);
      if (!notification) {
        throw new Error("Notification not found");
      }
      return notification;
    } catch (error) {
      throw new Error(`Failed to fetch notification: ${error.message}`);
    }
  }

  async updateNotification(id, data) {
    try {
      const notification = await Notification.findOne({ where: { vendor_id: id }});
      console.log(data)
      if (!notification) {
        throw new Error("Notification not found");
      }

      // Validate status if provided in data
      if (data.status) {
        const validStatuses = ['active', 'inactive'];
        if (!validStatuses.includes(data.status)) {
          throw new Error("Invalid status value. Must be 'active' or 'inactive'");
        }

        // Update status and sent_at if status changes to active
        const updateData = {
          ...data,
          status: data.status
        };

        if (data.status === 'active' && notification.status !== 'active') {
          updateData.sent_at = new Date();
          console.log(updateData);
        }

        await notification.update(updateData);
      } else {
        // If no status provided, update other fields normally
        await notification.update(data);
      }

      // Fetch the updated notification with associations
      const updatedNotification = await Notification.findOne({ where: { vendor_id: id }});

      return updatedNotification;
    } catch (error) {
      throw new Error(`Failed to update notification: ${error.message}`);
    }
}

  async deleteNotification(id) {
    try {
      const notification = await Notification.findByPk(id);
      if (!notification) {
        throw new Error("Notification not found");
      }
      await notification.destroy();
      return { message: "Notification deleted successfully" };
    } catch (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }
}

module.exports = new NotificationService();
