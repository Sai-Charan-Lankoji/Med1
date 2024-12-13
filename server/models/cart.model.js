const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Replace with your Sequelize instance

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  designs: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  designState: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  propsState: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  customer_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'cart',
  timestamps: true,
  paranoid: true,
});

module.exports = Cart;
