const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Product = require('./product.model'); 
const StandardProduct = require('./standardProduct.model'); 

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  designs: {
    type: DataTypes.JSONB,
    allowNull: true, // Only applicable for designable products
  },
  designState: {
    type: DataTypes.JSONB,
    allowNull: true, // Only applicable for designable products
  },
  propsState: {
    type: DataTypes.JSONB,
    allowNull: true, // Only applicable for designable products
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
  tableName: 'cart',
  timestamps: true,
  paranoid: true,
});

// Define Polymorphic Associations
Cart.belongsTo(Product, {
  foreignKey: 'product_id',
  constraints: false,
  as: 'designable_product',
});

Cart.belongsTo(StandardProduct, {
  foreignKey: 'product_id',
  constraints: false,
  as: 'standard_product',
});

module.exports = Cart;
