const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Store = require("./store.model"); // Import Store model

const StandardProduct = sequelize.define(
  "StandardProduct",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.FLOAT, allowNull: false },
    category: { type: DataTypes.ENUM("Clothing", "Shoes", "Accessories", "Electronics", "Home"), allowNull: false },
    sizes: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true, defaultValue: [] },
    colors: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    brand: { type: DataTypes.STRING, allowNull: true },
    sku: { type: DataTypes.STRING, allowNull: true, unique: true },
    weight: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0.0 },
    dimensions: { type: DataTypes.JSONB, allowNull: true, defaultValue: { length: 0, width: 0, height: 0 } },
    is_customizable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    is_discountable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    front_image: { type: DataTypes.STRING, allowNull: true },
    back_image: { type: DataTypes.STRING, allowNull: true },
    left_image: { type: DataTypes.STRING, allowNull: true },
    right_image: { type: DataTypes.STRING, allowNull: true },
    product_type: { type: DataTypes.STRING, allowNull: true },

    // Foreign Key for Store
    store_id: {
      type: DataTypes.STRING(250), // Matches Store ID type
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
      onDelete: "CASCADE", // If a store is deleted, its products are also deleted
    },
  },
  {
    tableName: "standard_products",
    timestamps: true,
    underscored: true,
    paranoid: true, 
  }
);

module.exports = StandardProduct;
