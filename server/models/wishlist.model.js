// backend/models/wishlist.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Wishlist = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.STRING(255),
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: "products",
        key: "id",
      },
    },
    standard_product_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "standard_products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "wishlists",
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      { fields: ["customer_id"] },
      { fields: ["product_id"] },
      { fields: ["standard_product_id"] },
      // No unique constraints here
    ],
  }
);

Wishlist.associate = (models) => {
  Wishlist.belongsTo(models.User, { foreignKey: "customer_id", as: "customer" });
  Wishlist.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
  Wishlist.belongsTo(models.StandardProduct, {
    foreignKey: "standard_product_id",
    as: "standardProduct",
  });
};

module.exports = Wishlist;