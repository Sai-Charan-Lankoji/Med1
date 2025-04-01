const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./product.model");
const Vendor = require("./vendor.model");

const Stock = sequelize.define(
  "Stock",
  {
    stock_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("Garments", "Fabrics", "Accessories", "Others"),
      allowNull: false,
    },
    stockType: {
      type: DataTypes.ENUM("Standard", "Designable"),
      allowNull: false,
    },
    hsnCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true, // Nullable for Designable stock
      references: { model: Product, key: "product_id" },
    },
    vendor_id: {
      type: DataTypes.STRING(250),
      allowNull: false,
      references: { model: "vendor", key: "id" },
    },

    gstPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0, max: 100 },
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    onHoldQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    exhaustedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
  },
  {
    tableName: "stock",
    timestamps: true,
    underscored: true,
  }
);


// Export the model without defining relationships here
module.exports = Stock;