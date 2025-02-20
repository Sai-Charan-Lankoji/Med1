const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const crypto = require("crypto");

// Function to generate a unique ID
const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

// Define the Admin Discount Model
const AdminDiscount = sequelize.define(
  "AdminDiscount",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    base_discount_threshold: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 100000, // Default: $100,000
    },
    high_discount_threshold: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 250000, // Default: $250,000
    },
    base_discount_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.9, // Default: 10% discount
    },
    high_discount_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.8, // Default: 20% discount
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "admin_discount",
    timestamps: false,
    hooks: {
      beforeCreate: (discount) => {
        if (!discount.id) {
          discount.id = generateEntityId("discount");
        }
      },
    },
  }
);

module.exports = AdminDiscount;
