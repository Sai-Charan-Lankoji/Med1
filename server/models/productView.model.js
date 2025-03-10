// models/productView.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProductView = sequelize.define(
  "product_view",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    store_id: { // New column
      type: DataTypes.STRING,
      allowNull: false,
    },
    vendor_id: { // Optional, can derive from Store
      type: DataTypes.STRING,
      allowNull: true,
    },
    viewed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    paranoid: false,
  }
);

module.exports = ProductView;