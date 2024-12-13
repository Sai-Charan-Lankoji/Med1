const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const crypto = require('crypto');

// Function to generate a unique ID
const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
};

const Customer = sequelize.define(
  'Customer',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billing_address_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    has_account: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    vendor_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'customer',
    timestamps: true, // Enables default `createdAt` and `updatedAt` fields
    createdAt: 'created_at', // Map Sequelize's createdAt to custom column name
    updatedAt: 'updated_at', // Map Sequelize's updatedAt to custom column name
    hooks: {
      beforeValidate: (customer) => {
        // Generate ID before validation (ensures field is set before any Sequelize action)
        if (!customer.id) {
          console.log('Generating ID for customer...');
          customer.id = generateEntityId('customer');
          console.log('Generated ID:', customer.id);
        }
      },
    },
  }
);

module.exports = Customer;
