const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const crypto = require('crypto');
const Customer = require('./customer.model'); // Customer model import cheyyali for relation

// Function to generate a unique ID
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
        model: Customer, // Links to Customer model
        key: 'id',      // References Customer's id field
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
      type: DataTypes.JSONB, // Extra info store cheyyadaniki (optional)
      allowNull: true,
    },
  },
  {
    tableName: 'CustomerAddress',
    timestamps: false, // Manual ga created_at, updated_at handle chestam
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