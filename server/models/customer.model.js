const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const crypto = require('crypto');

// Function to generate a unique ID
const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
};

const Customer = sequelize.define(
  "Customer",
  {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    first_name: { type: DataTypes.STRING, allowNull: true },
    last_name: { type: DataTypes.STRING, allowNull: true },
    billing_address_id: { type: DataTypes.STRING, allowNull: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    has_account: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    metadata: { type: DataTypes.JSONB, allowNull: true },
    vendor_id: { type: DataTypes.STRING, allowNull: true },
    profile_photo: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "customer",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeValidate: (customer) => {
        if (!customer.id) {
          customer.id = generateEntityId("customer");
        }
      },
    },
  }
);

module.exports = Customer;
