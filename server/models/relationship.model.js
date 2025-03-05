const StandardProduct = require("./standardProduct.model");
const Stock = require("./stock.model");
const StockVariant = require("./stockvariant.model");
const Store = require("./store.model");
const Cart2 = require("./cart2.model");
const Product = require("./product.model");

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
}

module.exports = defineRelationships;