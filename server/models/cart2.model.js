// models/cart2.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cart2 = sequelize.define(
  "Cart2",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_type: {
      type: DataTypes.ENUM("designable", "standard"),
      allowNull: false,
    },
    designs: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    designState: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    propsState: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    selected_size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    selected_color: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    selected_variant: {
      type: DataTypes.STRING, // Added for variantId
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true, // Note: Your teammate changed this to allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "cart_2",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Cart2;