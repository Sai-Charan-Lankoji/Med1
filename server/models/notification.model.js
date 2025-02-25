const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Vendor = require("./vendor.model");
const Invoice = require("./invoice.model");
const crypto = require("crypto");

// Utility function to generate a custom ID
const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    vendor_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "vendor",
        key: "id",
      },
    },
    invoice_id: {
      type: DataTypes.STRING,
      allowNull: true, // Optional, ties notification to a specific invoice
      references: {
        model: "invoice",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM("email", "push", "sms", "in-app"),
      allowNull: false,
      defaultValue: "email",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "inactive",
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "notification",
    timestamps: true, // created_at and updated_at
    underscored: true,
    paranoid: true, // Soft deletes with deleted_at
    hooks: {
      beforeCreate: (notification) => {
        notification.id = generateEntityId("notification");
      },
    },
  }
);

// Associations
Notification.belongsTo(Vendor, { foreignKey: "vendor_id", as: "vendor" });
Notification.belongsTo(Invoice, { foreignKey: "invoice_id", as: "invoice" });
Vendor.hasMany(Notification, { foreignKey: "vendor_id", as: "notifications" });
Invoice.hasMany(Notification, { foreignKey: "invoice_id", as: "notifications" });

module.exports = Notification;