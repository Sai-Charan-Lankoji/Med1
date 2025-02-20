// models/Transporter.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transporter = sequelize.define(
  "Transporter",
  {
    TransporterID: {
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
    tableName: "transporters",
    timestamps: false,
  }
);

module.exports = Transporter;