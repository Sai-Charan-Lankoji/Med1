const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = require('./product.model');
const StandardProduct = require('./standardProduct.model');

const Cart2 = sequelize.define('Cart2', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_type: {
    type: DataTypes.ENUM('designable', 'standard'),
    allowNull: false,
  },
  // Fields for designable products
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
  // Common fields for both product types
  selected_size: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  selected_color: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
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
  tableName: 'cart_2',
  timestamps: true,
  paranoid: true,
});

// Define Polymorphic Associations
Cart2.belongsTo(Product, {
  foreignKey: 'product_id',
  constraints: false,
  scope: {
    product_type: 'designable'
  },
  as: 'designable_product',
});

Cart2.belongsTo(StandardProduct, {
  foreignKey: 'product_id',
  constraints: false,
  scope: {
    product_type: 'standard'
  },
  as: 'standard_product',
});

module.exports = Cart2;