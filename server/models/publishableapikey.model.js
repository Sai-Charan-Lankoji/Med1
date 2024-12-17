const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Sequelize instance

const PublishableApiKey = sequelize.define('PublishableApiKey', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  revoked_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  revoked_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'publishable_api_key',
  timestamps: true,
  paranoid: true,
});

module.exports = PublishableApiKey;
