const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    vendor_id: { type: DataTypes.STRING, allowNull: true },
    store_id: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM("pending", "completed", "archived", "canceled", "requires_action"),
      allowNull: false,
      defaultValue: "pending",
    },
    fulfillment_status: {
      type: DataTypes.ENUM("not_fulfilled", "partially_fulfilled", "fulfilled", "partially_shipped", "shipped", "partially_returned", "returned", "canceled", "requires_action"),
      allowNull: false,
      defaultValue: "not_fulfilled",
    },
    payment_status: {
      type: DataTypes.ENUM("not_paid", "awaiting", "captured", "partially_refunded", "refunded", "canceled", "requires_action"),
      allowNull: false,
      defaultValue: "not_paid",
    },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    line_items: { type: DataTypes.JSONB, allowNull: true },
    public_api_key: { type: DataTypes.STRING, allowNull: true },
    currency_code: { type: DataTypes.STRING, allowNull: true, defaultValue: "INR" },
    customer_id: { type: DataTypes.STRING, allowNull: false },
    selected_variant: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false },
    merchant_transaction_id: { type: DataTypes.STRING, allowNull: true },
    shipping_address: { type: DataTypes.JSONB, allowNull: true },
    billing_address: { type: DataTypes.JSONB, allowNull: true },
  },
  {
    tableName: "order",
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

module.exports = Order;