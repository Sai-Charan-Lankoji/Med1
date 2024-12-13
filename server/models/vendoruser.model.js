const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Vendor = require("../models/vendor.model");

// Function to generate a custom ID
const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

// Define the `VendorUser` model
const VendorUser = sequelize.define(
  "VendorUser",
  {
    id: {
      type: DataTypes.STRING(250), // Use STRING to store the custom ID
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    vendor_id: {
      type: DataTypes.STRING(250),
      allowNull: true,
      references: {
        model: Vendor,
        key: 'id',
      },
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
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "vendor_user", // Use existing table name
    timestamps: true, // Enable created_at and updated_at
    underscored: true, // Use snake_case for column names
    paranoid: true, // Enable deleted_at for soft deletes
    hooks: {
      // Generate the ID before creating a record
      beforeCreate: (vendorUser) => {
        vendorUser.id = generateEntityId("vuser");
      },
      // Hash password before saving
      beforeCreate: async (vendorUser) => {
        if (vendorUser.password) {
          const hashedPassword = await bcrypt.hash(vendorUser.password, 10);
          vendorUser.password = hashedPassword;
        }
      },
    },
  }
);

module.exports = VendorUser;
