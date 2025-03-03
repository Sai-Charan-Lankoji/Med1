const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); 
const crypto = require("crypto"); 
const Wishlist = require("./wishlist.model");


const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING, // Set as STRING since UUIDs are strings
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    api_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("member","admin","developer"),
      allowNull: true, 
      defaultValue: "member",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    }, 
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue:sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "user",
    timestamps: false,
    underscored: true, // Use snake_case for column names
    paranoid: true, 
    hooks: {
      beforeCreate: (user) => {
        if (!user.id) {
          user.id = generateEntityId("user");
        }
      },
    },
  } 


); 


module.exports = User;
