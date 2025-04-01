const StandardProduct = require("./standardProduct.model");
const Stock = require("./stock.model");
const StockVariant = require("./stockvariant.model");
const Store = require("./store.model");
const Cart2 = require("./cart2.model");
const Product = require("./product.model");
const Vendor = require("./vendor.model");
const Address = require("../models/address.model")
const Plan = require('../models/plan.model');


function defineRelationships() {
  // Stock and StandardProduct (1:1)
  Stock.hasOne(StandardProduct, { foreignKey: "stock_id", as: "StandardProduct" });
  StandardProduct.belongsTo(Stock, { foreignKey: "stock_id", as: "Stock" });

  // Stock and StockVariant (1:N)
  Stock.hasMany(StockVariant, { foreignKey: "stock_id", as: "StockVariants" });
  StockVariant.belongsTo(Stock, { foreignKey: "stock_id", as: "Stock" });

  // Store and StandardProduct (1:N)
  Store.hasMany(StandardProduct, { foreignKey: "store_id", as: "StandardProducts" });
  StandardProduct.belongsTo(Store, { foreignKey: "store_id", as: "Store" });

  // Cart2 Polymorphic Associations
  Cart2.belongsTo(Product, {
    foreignKey: "product_id",
    constraints: false,
    as: "designable_product",
  });
  Cart2.belongsTo(StandardProduct, {
    foreignKey: "product_id",
    constraints: false,
    as: "standard_product",
  });

  Product.hasMany(Cart2, { foreignKey: "product_id", constraints: false });
  StandardProduct.hasMany(Cart2, { foreignKey: "product_id", constraints: false });

  Vendor.hasMany(Address, {
    foreignKey: "vendor_address_id",
    as: "address",
  });
  
  Address.belongsTo(Vendor, {
    foreignKey: "id",
    as: "vendor",
  }); 
  Vendor.hasMany(Store, {
    foreignKey: "vendor_id",
    as: "stores",
  });
  
  Store.belongsTo(Vendor, {
    foreignKey: "vendor_id",
    as: "vendor",
  });
  
  Vendor.belongsTo(Plan, {
    foreignKey: "plan_id",
    as: "subscription_plan",
  });
  
  Vendor.hasMany(Stock, {
    foreignKey: "vendor_id",
    as: "stocks",
  });
  
  Stock.belongsTo(Vendor, {
    foreignKey: "vendor_id",
    as: "vendor",
  });
}

module.exports = defineRelationships;