// Import necessary dependencies
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Address = require("../models/address.model")
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
      },
    },
  }
);

// Define associations
Vendor.hasMany(Address, {
  foreignKey: "vendor_address_id",
  as: "address",
});

Address.belongsTo(Vendor, {
  foreignKey: "id",
  as: "vendor",
});

// Export the models
module.exports = Vendor
