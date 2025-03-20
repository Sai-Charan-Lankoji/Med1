const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const crypto = require('crypto');
const Customer = require('./customer.model');

const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
};

const CustomerAddress = sequelize.define(
  'CustomerAddress',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Customer,
        key: 'id',
      },
    },
    customer_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_type: { // New field to distinguish billing vs shipping
      type: DataTypes.ENUM('billing', 'shipping'),
      allowNull: true, // Nullable for backward compatibility
      defaultValue: null, // Default to null if not specified
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: 'CustomerAddress',
    timestamps: false,
    hooks: {
      beforeValidate: (address) => {
        if (!address.id) {
          address.id = generateEntityId('address');
        }
      },
    },
  }
);

// Define relationship with Customer
Customer.hasMany(CustomerAddress, { foreignKey: 'customer_id' });
CustomerAddress.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = CustomerAddress;