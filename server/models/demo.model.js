// server/models/demo.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DemoRequest = sequelize.define('DemoRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'completed'),
    defaultValue: 'new'
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'demo_requests'
});

module.exports = DemoRequest;