const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Stock = require("./stock.model");
const Product = require("./product.model");

const StockVariant = sequelize.define(
  "StockVariant",
  {
    variantId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    stockId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Stock, key: "stock_id" },
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "stock_variants",
    timestamps: true,
    underscored: true,
    indexes: [{ unique: true, fields: ["stockId", "size", "color"] }],
  }
);

// Define relationships
Stock.hasMany(StockVariant, { foreignKey: "stockId", as: "variants" });
StockVariant.belongsTo(Stock, { foreignKey: "stockId", as: "stock" });
Stock.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = StockVariant;