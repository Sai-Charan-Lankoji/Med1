const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// const Store = require("./store.model");
// const Vendor = require("./vendormodel"); 
const Wishlist = require("./wishlist.model");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
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
    },
    customizable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    store_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vendor_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designs: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    designstate: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    propstate: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    product_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sale: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    origin_country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mid_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    collection_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    external_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discountable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    sizes: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true,  },
    
  },
  {
    tableName: "product", 
    timestamps: false,
  }
); 



Product.hasMany(Wishlist, { foreignKey: "product_id", as: "wishlistedBy" });

// // Many-to-One: Product -> Store
// Product.belongsTo(Store, {
//   foreignKey: "store_id",
//   targetKey: "id",
//   as: "store",
// });

// // Many-to-One: Product -> Vendor
// Product.belongsTo(Vendor, {
//   foreignKey: "vendor_id",
//   targetKey: "id",
//   as: "vendor",
// });

module.exports = Product;
