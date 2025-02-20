// models/Consignment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Supplier = require("./supplier.model");
const Transporter = require("./transporter.model");

const Consignment = sequelize.define(
  "Consignment",
  {
    ConsignmentNumber: { type: DataTypes.STRING, primaryKey: true },
    SupplierID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Supplier, key: "SupplierID" },
    },
    TransporterID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Transporter, key: "TransporterID" },
    },
    Date: { type: DataTypes.DATEONLY, allowNull: false },
  },
  {
    tableName: "consignments",
    timestamps: false,
  }
);

// Relationships
Consignment.belongsTo(Supplier, { foreignKey: "SupplierID" });
Consignment.belongsTo(Transporter, { foreignKey: "TransporterID" });

module.exports = Consignment;