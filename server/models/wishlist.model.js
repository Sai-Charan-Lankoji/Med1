const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Wishlist = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING, // Ensure this matches User.id
      allowNull: false,
    },

    // Ensure product_id matches the data type in the Product model (STRING)
    product_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    standard_product_id: {
      type: DataTypes.STRING, // Change from UUID to STRING
      allowNull: true,
    },
  },
  {
    tableName: "wishlists",
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

module.exports = Wishlist;
