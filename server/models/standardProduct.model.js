// models/StandardProduct.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Store = require("./store.model"); // Assuming this exists
const Stock = require("./stock.model");

const StandardProduct = sequelize.define(
  "StandardProduct",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: false },
    category: { 
      type: DataTypes.ENUM("Clothing", "Shoes", "Accessories", "Electronics", "Home"), 
      allowNull: false 
    },
    sizes: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true, defaultValue: [] },
    colors: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
    stock: { type: DataTypes.INTEGER, allowNull: true },
    stockId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: Stock, key: "stockId" },
    },
    brand: { type: DataTypes.STRING, allowNull: true },
    sku: { type: DataTypes.STRING, allowNull: true, unique: true },
    discount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
    customizable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    sale: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    front_image: { type: DataTypes.STRING, allowNull: true },
    back_image: { type: DataTypes.STRING, allowNull: true },
    left_image: { type: DataTypes.STRING, allowNull: true },
    right_image: { type: DataTypes.STRING, allowNull: true },
    product_type: { type: DataTypes.STRING, allowNull: true },
    store_id: {
      type: DataTypes.STRING(250),
      allowNull: false,
      references: { model: Store, key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "standard_products",
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

module.exports = StandardProduct;