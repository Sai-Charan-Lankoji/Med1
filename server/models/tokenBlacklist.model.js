const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Ensure this is your sequelize instance

const TokenBlacklist = sequelize.define("TokenBlacklist", {
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = TokenBlacklist;
