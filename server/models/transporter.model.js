// models/Transporter.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transporter = sequelize.define(
  "Transporter",
  {
    transporter_id: {
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
    tableName: "transporters",
    timestamps: false,
  }
);

module.exports = Transporter;