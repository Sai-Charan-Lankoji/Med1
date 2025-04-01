// Import necessary dependencies
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const crypto = require("crypto"); 


// Function to generate a custom ID
const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};


// Define the `Vendor` model
const Vendor = sequelize.define(
  "Vendor",
  {
    id: {
      type: DataTypes.STRING(250), // Use STRING to store the custom ID
      primaryKey: true,
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    contact_name: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    registered_number: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    status:{
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      allowNull: false,
      defaultValue: 'active',
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    contact_phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    tax_number: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    plan: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    plan_id: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    next_billing_date: {
      type: DataTypes.DATE,
      allowNull: true, // Will be set after registration
    },
    business_type: {
      type: DataTypes.ENUM(
        "Apparel Design",
        "GroceryStore",
        "PaperDesignPrinting",
        "FootballFranchise",
        "Baseball Franchise"
      ),
      defaultValue: "Apparel Design",
    },
  },
  {
    tableName: "vendor", // Use existing table name
    timestamps: true, // Enable created_at and updated_at
    underscored: true, // Use snake_case for column names
    paranoid: true, // Enable deleted_at for soft deletes
    hooks: {
      beforeCreate: (vendor) => {
        vendor.id = generateEntityId("vendor");
        // Set initial billing date as 30 days from creation
        vendor.next_billing_date = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        );
      },
    },
  }
);
// Define associations


// Export the models
module.exports = Vendor
