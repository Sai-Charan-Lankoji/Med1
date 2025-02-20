// models/StockTransaction.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const StandardProduct = require("./standardProduct.model");

const StockTransaction = sequelize.define(
  "StockTransaction",
  {
    TransactionID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ProductID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: StandardProduct, key: "id" },
    },
    Size: { type: DataTypes.STRING, allowNull: true }, // e.g., "M"
    Color: { type: DataTypes.STRING, allowNull: true }, // e.g., "Red"
    Quantity: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      validate: { min: 0 }, // Ensure non-negative quantity
    },
    PurchasedPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 }, // Cost per unit from supplier
    },
    SellingPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 }, // Selling price per unit
    },
    Date: { type: DataTypes.DATEONLY, allowNull: false },
    Type: { type: DataTypes.STRING, allowNull: false }, // e.g., "Receive"
    Reference: { type: DataTypes.STRING, allowNull: true }, // Links to ConsignmentNumber
  },
  {
    tableName: "stock_transactions",
    timestamps: false,
  }
);

// Relationships
StandardProduct.hasMany(StockTransaction, { foreignKey: "ProductID" });
StockTransaction.belongsTo(StandardProduct, { foreignKey: "ProductID" });

module.exports = StockTransaction;