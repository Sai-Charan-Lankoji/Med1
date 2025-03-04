// models/Stock.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const StandardProduct = require("./standardProduct.model");

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

// StandardProduct.hasOne(Stock, { foreignKey: "productId" });
// Stock.belongsTo(StandardProduct, { foreignKey: "productId" });

module.exports = Stock;