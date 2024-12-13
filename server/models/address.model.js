// Import necessary dependencies
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const crypto = require("crypto");

// Function to generate a custom ID
const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

// Define the `Address` model
const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.STRING(250), // Use STRING to store the custom ID
      primaryKey: true,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    address_1: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    address_2: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    country_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    vendor_address_id: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    registration_address_id:{
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "address", // Use the desired table name
    timestamps: true, // Enable created_at and updated_at
    underscored: true, // Use snake_case for column names
    paranoid: true, // Enable deleted_at for soft deletes
    hooks: {
      beforeCreate: (address) => {
        address.id = generateEntityId("address");
      },
    },
  }
);

module.exports = Address