// models/ConsignmentDetail.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Consignment = require("./consignment.model");
const StandardProduct = require("./standardProduct.model");

const ConsignmentDetail = sequelize.define(
  "ConsignmentDetail",
  {
    ConsignmentDetailID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ConsignmentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: Consignment, key: "ConsignmentNumber" },
    },
    ProductID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: StandardProduct, key: "id" },
    },
    Size: { type: DataTypes.STRING, allowNull: true }, // e.g., "M"
    Color: { type: DataTypes.STRING, allowNull: true }, // e.g., "Red"
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
  },
  {
    tableName: "consignment_details",
    timestamps: false,
  }
);

// Relationships
Consignment.hasMany(ConsignmentDetail, { foreignKey: "ConsignmentNumber" });
ConsignmentDetail.belongsTo(Consignment, { foreignKey: "ConsignmentNumber" });
StandardProduct.hasMany(ConsignmentDetail, { foreignKey: "ProductID" });
ConsignmentDetail.belongsTo(StandardProduct, { foreignKey: "ProductID" });

module.exports = ConsignmentDetail;