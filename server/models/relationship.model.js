// models/relationship.model.js
const StandardProduct = require("./standardProduct.model");
const Stock = require("./stock.model");
const StockVariant = require("./stockvariant.model");
const Store = require("./store.model");
const Cart2 = require("./cart2.model");
const Product = require("./product.model");

function defineRelationships() {
  // Stock and StandardProduct (1:1)
  Stock.hasOne(StandardProduct, { foreignKey: "stock_id" });
  StandardProduct.belongsTo(Stock, { foreignKey: "stock_id" });

  // Stock and StockVariant (1:N)
  Stock.hasMany(StockVariant, { foreignKey: "stock_id" });
  StockVariant.belongsTo(Stock, { foreignKey: "stock_id" });

  // Store and StandardProduct (1:N)
  Store.hasMany(StandardProduct, { foreignKey: "store_id" });
  StandardProduct.belongsTo(Store, { foreignKey: "store_id" });

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

  // Reverse relationships (optional, if needed)
  Product.hasMany(Cart2, { foreignKey: "product_id", constraints: false });
  StandardProduct.hasMany(Cart2, { foreignKey: "product_id", constraints: false });
}

module.exports = defineRelationships;