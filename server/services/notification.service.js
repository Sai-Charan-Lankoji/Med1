// notification.service.js
require("dotenv").config();
const Notification = require("../models/notification.model");
const Vendor = require("../models/vendor.model");
const Invoice = require("../models/invoice.model");
const Plan = require("../models/plan.model");
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

// Verify environment variables are loaded
const verifyEnvVariables = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email credentials not found in environment variables. Ensure EMAIL_USER and EMAIL_PASS are set in .env file"
    );
  }
};

// Create email transporter with explicit configuration
let transporter;
try {
  verifyEnvVariables();
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Optional: for development only
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      logger.error("Transporter verification failed:", error);
    } else {
      logger.info("Email transporter configured successfully");
    }
  });
} catch (error) {
  logger.error("Failed to initialize email transporter:", error.message);
}

// Send plan subscription reminder email
const sendPlanSubscriptionReminderEmail = async (
  vendor,
  planPrice,
  nextBillingDate
) => {
  try {
    verifyEnvVariables();
    if (!vendor.contact_email) {
      throw new Error("Vendor email address is missing");
    }

    const mailOptions = {
      from: `"Calibrage Team" <${process.env.EMAIL_USER}>`,
      to: vendor.contact_email,
      subject: "Plan Subscription Reminder: Payment Due in 7 Days",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Plan Subscription Reminder</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="padding: 20px;">
                <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td align="center" style="padding: 20px 0;">
                      <img src="https://calibrage.in/assets/images/calibrage-logo.png" alt="Company Logo" style="max-width: 150px; height: auto;" border="0">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 40px; color: #333;">
                      <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Plan Subscription Reminder</h1>
                      <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                        Dear <strong style="color: #2c3e50;">${
                          vendor.contact_name || "Valued Customer"
                        }</strong>,
                      </p>
                      <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                        We would like to remind you about your upcoming payment for your 
                        <strong style="color: #2c3e50;">${
                          vendor.plan || "subscription"
                        }</strong> plan with 
                        <strong style="color: #2c3e50;">${
                          vendor.company_name || "Calibrage"
                        }</strong>.
                      </p>
                      <h2 style="color: #2c3e50; font-size: 20px; margin: 20px 0 10px;">Subscription Details</h2>
                      <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                        Your subscription plan fee of 
                        <strong style="color: #e74c3c;">$${planPrice}</strong> is due on 
                        <strong style="color: #2c3e50;">${nextBillingDate.toDateString()}</strong>. 
                        Please ensure your payment method is up to date to avoid any disruptions.
                      </p>
                      <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                        If you have any questions or need assistance, feel free to contact our support team.
                      </p>
                      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="https://yourwebsite.com/manage-billing" 
                               style="display: inline-block; padding: 12px 24px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                              Manage Billing
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="color: #7f8c8d; font-size: 14px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
                        Thank you,<br>
                        <strong style="color: #2c3e50;">Calibrage Team</strong><br>
                        <a href="https://calibrage.in" style="color: #3498db; text-decoration: none;">Calibrage</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(
      `Email sent successfully to ${vendor.contact_email}: ${info.messageId}`
    );
    return true;
  } catch (error) {
    logger.error(
      `Failed to send email to ${vendor.contact_email}: ${error.message}`
    );
    return false;
  }
};

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
      const notification = await Notification.findOne({
        where: { vendor_id: id },
      });
      console.log(data);
      if (!notification) {
        throw new Error("Notification not found");
      }

      if (data.status) {
        const validStatuses = ["active", "inactive"];
        if (!validStatuses.includes(data.status)) {
          throw new Error(
            "Invalid status value. Must be 'active' or 'inactive'"
          );
        }

        const updateData = {
          ...data,
          status: data.status,
        };

        if (data.status === "active" && notification.status !== "active") {
          updateData.sent_at = new Date();
          console.log(updateData);

          // Fetch vendor and plan details for email
          const vendor = await Vendor.findByPk(notification.vendor_id);
          if (!vendor) throw new Error("Associated vendor not found");

          const plan = await Plan.findByPk(vendor.plan_id);
          if (!plan) throw new Error("Associated plan not found");

          const planPrice = plan.price;
          const nextBillingDate =
            vendor.next_billing_date ||
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

          // Send email
          const emailSent = await sendPlanSubscriptionReminderEmail(
            vendor,
            planPrice,
            nextBillingDate
          );
          if (!emailSent) logger.warn("Email sending failed");
        }

        await notification.update(updateData);
      } else {
        await notification.update(data);
      }

      const updatedNotification = await Notification.findOne({
        where: { vendor_id: id },
      });

      // Emit WebSocket event if io is available
      if (this.io) {
        this.io
          .to(`vendor_${id}`)
          .emit("notificationUpdate", updatedNotification);
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
