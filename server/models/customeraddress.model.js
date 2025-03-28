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
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[0-9]{10,15}$/, // Basic phone number validation (10-15 digits)
      },
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    landmark: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
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
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_type: {
      type: DataTypes.ENUM('billing', 'shipping'),
      allowNull: true,
      defaultValue: null,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Default to false if not specified
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
      // Ensure only one address is default per customer
      beforeSave: async (address, options) => {
        if (address.is_default) {
          await CustomerAddress.update(
            { is_default: false },
            {
              where: {
                customer_id: address.customer_id,
                id: { [sequelize.Op.ne]: address.id }, // Exclude the current address
              },
              transaction: options.transaction,
            }
          );
        }
      },
    },
  }
);

// Define relationship with Customer
Customer.hasMany(CustomerAddress, { foreignKey: 'customer_id' });
CustomerAddress.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = CustomerAddress;