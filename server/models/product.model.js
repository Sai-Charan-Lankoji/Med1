const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
// const Store = require("./store.model");
// const Vendor = require("./vendormodel");

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
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    handle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_giftcard: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hs_code: {
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
  },
  {
    tableName: "product", 
    timestamps: false,
  }
); 





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
