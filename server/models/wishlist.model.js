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
    customer_id: {
      type: DataTypes.UUID, // Changed to UUID for consistency with typical user IDs
      allowNull: false,
      references: {
        model: "users", // Assuming a 'users' table exists
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.UUID, // Changed to UUID assuming Product model uses UUID
      allowNull: true,
      references: {
        model: "products",
        key: "id",
      },
    },
    standard_product_id: {
      type: DataTypes.UUID, // Changed to UUID for consistency
      allowNull: true,
      references: {
        model: "standard_products",
        key: "id",
      },
    },
  },
  {
    tableName: "wishlists",
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft deletes are great for recovery
    indexes: [
      { fields: ["customer_id"] }, // Speed up queries by customer
      { fields: ["product_id"] },
      { fields: ["standard_product_id"] },
      { fields: ["customer_id", "product_id"], unique: true }, // Prevent duplicates
      { fields: ["customer_id", "standard_product_id"], unique: true },
    ],
  }
);

// Define associations (assuming Product and StandardProduct models exist)
Wishlist.associate = (models) => {
  Wishlist.belongsTo(models.User, { foreignKey: "customer_id", as: "customer" });
  Wishlist.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
  Wishlist.belongsTo(models.StandardProduct, {
    foreignKey: "standard_product_id",
    as: "standardProduct",
  });
};

module.exports = Wishlist;