// models/Supplier.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Supplier = sequelize.define(
  "Supplier",
  {
    supplier_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    contact_info: { type: DataTypes.STRING, allowNull: true },
    gstin: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "suppliers",
    timestamps: false,
  }
);

module.exports = Supplier;