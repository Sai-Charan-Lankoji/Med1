const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { Op, fn, col, literal } = require("sequelize");
const Vendor = require("../models/vendor.model");
const Notification = require("../models/notification.model");
const Order = require("../models/order.model");
const Store = require("../models/store.model");
const Plan = require("../models/plan.model");
const logger = require("../utils/logger");

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to calculate billing details (plan price, admin commission, payable amount)
const calculateBillingDetails = async (vendorId) => {
  try {
    const vendor = await Vendor.findOne({
      where: { id: vendorId },
      include: [{ model: Plan, as: "subscription_plan", attributes: ["commission_rate", "price"] }],
    });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const planPrice = parseFloat(vendor.subscription_plan?.price) || 0;
    const commissionRate = vendor.subscription_plan?.commission_rate || 0;

    // Fetch commissionable orders (total_amount > 200) for total admin commission
    const commissionableOrders = await Order.findAll({
      attributes: [
        "store_id",
        "total_amount",
        "created_at",
        [literal(`(CAST("total_amount" AS FLOAT) * ${commissionRate})`), "admin_commission"],
      ],
      where: {
        vendor_id: vendorId,
        [Op.and]: [
          literal(`CAST("total_amount" AS FLOAT) > 200`),
          { status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] } },
          { payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action"] } },
        ],
      },
      order: [["created_at", "ASC"]],
    });

    const stores = await Store.findAll({
      attributes: ["id", "name"],
      raw: true,
    });

    const storeMap = {};
    stores.forEach((store) => {
      storeMap[store.id] = store.name;
    });

    let totalAdminCommission = 0;
    const commissionByStore = {};
    commissionableOrders.forEach((order) => {
      const storeId = order.store_id;
      const revenue = parseFloat(order.total_amount || 0);
      const commission = parseFloat(order.getDataValue("admin_commission") || 0);

      totalAdminCommission += commission;

      if (!commissionByStore[storeId]) {
        commissionByStore[storeId] = { total_revenue: 0 };
      }

      commissionByStore[storeId].total_revenue += revenue;
    });

    totalAdminCommission = parseFloat(totalAdminCommission.toFixed(2)) || 0;
    const payableAmount = parseFloat((planPrice + totalAdminCommission).toFixed(2)) || 0;

    logger.info(`Calculated billing details for vendor ${vendorId}: Plan Price = $${planPrice.toFixed(2)}, Total Admin Commission = $${totalAdminCommission.toFixed(2)}, Total Payable = $${payableAmount.toFixed(2)}`);
    return {
      planPrice,
      totalAdminCommission,
      payableAmount,
      commissionByStore, // Keep for potential future use
    };
  } catch (error) {
    logger.error(`Error calculating billing details for vendor ${vendorId}: ${error.message}`);
    return {
      planPrice: 0,
      totalAdminCommission: 0,
      payableAmount: 100.00,
      commissionByStore: {},
    };
  }
};

// Function to send plan subscription reminder email (7 days before)
const sendPlanSubscriptionReminderEmail = async (vendor, planPrice, nextBillingDate) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
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
                <!-- Header with Logo -->
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <img src="https://calibrage.in/assets/images/calibrage-logo.png" alt="Company Logo" style="max-width: 150px; height: auto;" border="0">
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px; color: #333;">
                    <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Plan Subscription Reminder</h1>
                    <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                      Dear <strong style="color: #2c3e50;">${vendor.contact_name}</strong>,
                    </p>
                    <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                      We would like to remind you about your upcoming payment for your <strong style="color: #2c3e50;">${vendor.plan}</strong> plan with <strong style="color: #2c3e50;">${vendor.company_name}</strong>.
                    </p>
                    <h2 style="color: #2c3e50; font-size: 20px; margin: 20px 0 10px;">Subscription Details</h2>
                    <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                      Your subscription plan fee of <strong style="color: #e74c3c;">$${planPrice.toFixed(2)}</strong> is due on <strong style="color: #2c3e50;">${nextBillingDate.toDateString()}</strong>. Please ensure your payment method is up to date to avoid any disruptions.
                    </p>
                    <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                      If you have any questions or need assistance, feel free to contact our support team.
                    </p>
                    <!-- Call-to-Action Button -->
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
                    <!-- Footer -->
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

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Plan subscription reminder email sent to ${vendor.contact_email}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send plan subscription reminder email to ${vendor.contact_email}: ${error.message}`);
    return false;
  }
};

// Function to send admin commission reminder email (on next_billing_date)
const sendAdminCommissionReminderEmail = async (vendor, totalAdminCommission, nextBillingDate) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: vendor.contact_email,
    subject: "Admin Commission Due Today",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Commission Reminder</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding: 20px;">
              <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <!-- Header with Logo -->
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <img src="https://calibrage.in/assets/images/calibrage-logo.png" alt="Company Logo" style="max-width: 150px; height: auto;" border="0">
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px; color: #333;">
                    <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Admin Commission Reminder</h1>
                    <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                      Dear <strong style="color: #2c3e50;">${vendor.contact_name}</strong>,
                    </p>
                    <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                      We would like to inform you about your admin commission due today for your <strong style="color: #2c3e50;">${vendor.plan}</strong> plan with <strong style="color: #2c3e50;">${vendor.company_name}</strong>.
                    </p>
                    <h2 style="color: #2c3e50; font-size: 20px; margin: 20px 0 10px;">Commission Details</h2>
                    <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                      Your total admin commission for this billing cycle is <strong style="color: #e74c3c;">$${totalAdminCommission.toFixed(2)}</strong>, due on <strong style="color: #2c3e50;">${nextBillingDate.toDateString()}</strong>. Please ensure this amount is settled to maintain your account in good standing.
                    </p>
                    <p style="color: #7f8c8d; font-size: 16px; line-height: 1.5;">
                      If you have any questions or need assistance, feel free to contact our support team.
                    </p>
                    <!-- Call-to-Action Button -->
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
                    <!-- Footer -->
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

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Admin commission reminder email sent to ${vendor.contact_email}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send admin commission reminder email to ${vendor.contact_email}: ${error.message}`);
    return false;
  }
};


// Function to create a notification
const createNotification = async (vendorId, message, status) => {
  try {
    const notification = await Notification.create({
      vendor_id: vendorId,
      type: "email",
      message,
      status,
    });
    logger.info(`Notification created for vendor ${vendorId}: ${notification.id}`);
    return notification;
  } catch (error) {
    logger.error(`Failed to create notification for vendor ${vendorId}: ${error.message}`);
    throw error;
  }
};

// Scheduler function
const startBillingScheduler = () => {
  // Schedule for 7 days before next_billing_date (e.g., daily at 9 AM)
  const reminderTask = cron.schedule("0 9 * * *", async () => {
    try {
      logger.info("Starting billing reminder scheduler (7 days before)...");

      const today = new Date();
      const reminderDate = new Date(today);
      reminderDate.setDate(today.getDate() + 7); // 7 days from now

      const reminderDateStr = reminderDate.toISOString().split("T")[0];
      logger.info(`Today: ${today.toISOString().split("T")[0]}, Reminder Date: ${reminderDateStr}`);

      const vendors = await Vendor.findAll({
        where: {
          [Op.and]: [
            literal(`DATE("next_billing_date") = '${reminderDateStr}'`),
            { status: "active" },
          ],
        },
      });

      logger.info(`Found ${vendors.length} vendors due for plan subscription reminder on ${reminderDateStr}`);

      if (vendors.length === 0) {
        logger.info("No vendors due for plan subscription reminder on this run.");
        return;
      }

      for (const vendor of vendors) {
        try {
          const billingDetails = await calculateBillingDetails(vendor.id);
          const message = `Plan subscription reminder: $${billingDetails.planPrice.toFixed(2)} due on ${vendor.next_billing_date.toDateString()}`;

          const emailSent = await sendPlanSubscriptionReminderEmail(vendor, billingDetails.planPrice, vendor.next_billing_date);
          const notificationStatus = "inactive";
          const notification = await createNotification(vendor.id, message, notificationStatus);

          if (emailSent) {
            notification.sent_at = new Date();
            await notification.save();
          }
        } catch (error) {
          logger.error(`Error processing vendor ${vendor.id} for plan reminder: ${error.message}`);
        }
      }

      logger.info("Billing reminder scheduler (7 days before) completed successfully.");
    } catch (error) {
      logger.error(`Billing reminder scheduler (7 days before) failed: ${error.message}`);
    }
  }, {
    scheduled: true,
    timezone: "UTC",
  });

  // Schedule for exact next_billing_date (e.g., daily at 9 AM)
  const dueDateTask = cron.schedule("0 9 * * *", async () => {
    try {
      logger.info("Starting billing due date scheduler (on due date)...");

      const today = new Date();
      const dueDateStr = today.toISOString().split("T")[0];
      logger.info(`Today (due date): ${dueDateStr}`);

      const vendors = await Vendor.findAll({
        where: {
          [Op.and]: [
            literal(`DATE("next_billing_date") = '${dueDateStr}'`),
            { status: "active" },
          ],
        },
      });

      logger.info(`Found ${vendors.length} vendors due for admin commission reminder on ${dueDateStr}`);

      if (vendors.length === 0) {
        logger.info("No vendors due for admin commission reminder on this run.");
        return;
      }

      for (const vendor of vendors) {
        try {
          const billingDetails = await calculateBillingDetails(vendor.id);
          const message = `Admin commission reminder: $${billingDetails.totalAdminCommission.toFixed(2)} due on ${vendor.next_billing_date.toDateString()}`;

          const emailSent = await sendAdminCommissionReminderEmail(vendor, billingDetails.totalAdminCommission, vendor.next_billing_date);
          const notificationStatus = emailSent ? "sent" : "failed";
          const notification = await createNotification(vendor.id, message, notificationStatus);

          if (emailSent) {
            notification.sent_at = new Date();
            await notification.save();
          }
        } catch (error) {
          logger.error(`Error processing vendor ${vendor.id} for admin commission reminder: ${error.message}`);
        }
      }

      logger.info("Billing due date scheduler (on due date) completed successfully.");
    } catch (error) {
      logger.error(`Billing due date scheduler (on due date) failed: ${error.message}`);
    }
  }, {
    scheduled: true,
    timezone: "UTC",
  });

  // Handle server shutdown gracefully
  process.on("SIGINT", () => {
    logger.info("Received SIGINT. Stopping schedulers...");
    reminderTask.stop();
    dueDateTask.stop();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    logger.info("Received SIGTERM. Stopping schedulers...");
    reminderTask.stop();
    dueDateTask.stop();
    process.exit(0);
  });

  // Start both schedulers
  reminderTask.start();
  dueDateTask.start();
  logger.info("Billing schedulers started successfully. Running daily at 9 AM UTC for testing.");
};

// Export the scheduler function
module.exports = { startBillingScheduler };