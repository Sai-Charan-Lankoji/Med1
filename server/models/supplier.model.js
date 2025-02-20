// models/Supplier.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Supplier = sequelize.define(
  "Supplier",
  {
    SupplierID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    Name: { type: DataTypes.STRING, allowNull: false },
    ContactInfo: { type: DataTypes.STRING, allowNull: true },
    GSTIN: { type: DataTypes.STRING, allowNull: true },
    Address: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "suppliers",
    timestamps: false,
  }
);

module.exports = Supplier;