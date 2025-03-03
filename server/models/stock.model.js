// models/Stock.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const StandardProduct = require("./standardProduct.model");

const Stock = sequelize.define(
  "Stock",
  {
    stockId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: StandardProduct, key: "id" },
      unique: true, // One-to-one with ProductID
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // e.g., "Batch 1"
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

StandardProduct.hasOne(Stock, { foreignKey: "productId" });
Stock.belongsTo(StandardProduct, { foreignKey: "productId" });

module.exports = Stock;