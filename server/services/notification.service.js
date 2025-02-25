// services/notification.service.js
const Notification = require("../models/notification.model");
const Vendor = require("../models/vendor.model");
const Invoice = require("../models/invoice.model");

class NotificationService {
  constructor() {
    this.io = null; // Will hold the socket.io instance
  }

  setSocketIo(io) {
    this.io = io;
  }

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
      const notification = await Notification.findOne({ where: { vendor_id: id } });
      console.log(data);
      if (!notification) {
        throw new Error("Notification not found");
      }

      if (data.status) {
        const validStatuses = ["active", "inactive"];
        if (!validStatuses.includes(data.status)) {
          throw new Error("Invalid status value. Must be 'active' or 'inactive'");
        }

        const updateData = {
          ...data,
          status: data.status,
        };

        if (data.status === "active" && notification.status !== "active") {
          updateData.sent_at = new Date();
          console.log(updateData);
        }

        await notification.update(updateData);
      } else {
        await notification.update(data);
      }

      const updatedNotification = await Notification.findOne({ where: { vendor_id: id } });

      // Emit WebSocket event
      if (this.io) {
        this.io.to(`vendor_${id}`).emit("notificationUpdate", updatedNotification);
      }

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