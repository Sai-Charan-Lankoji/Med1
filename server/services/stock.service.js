// services/stock.service.js
const Stock = require("../models/stock.model");
const StockVariant = require("../models/stockvariant.model");
const { Op } = require("sequelize");



class StockService {
  // Create stock with variants
  async createStock({ title, variants }) {
    const totalQuantity = variants.reduce((sum, v) => sum + v.totalQuantity, 0);
    const availableQuantity = totalQuantity;

    const stock = await Stock.create({
      title,
      totalQuantity,
      availableQuantity,
      onHoldQuantity: 0,
      exhaustedQuantity: 0,
    });

    const variantEntries = variants.map(v => ({
      stock_id: stock.stock_id,
      size: v.size,
      color: v.color,
      totalQuantity: v.totalQuantity,
      availableQuantity: v.totalQuantity,
      onHoldQuantity: 0,
      exhaustedQuantity: 0,
    }));
    await StockVariant.bulkCreate(variantEntries);
    return stock;
  }

  // Link stock to product
  async linkStockToProduct(stock_id, productId) {
    const updated = await Stock.update(
      { productId },
      { where: { stock_id } }
    );
    if (!updated[0]) throw new Error("Stock not found");
    return updated;
  }

  // Order placed: Move from available to on-hold
  async placeOrder(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error("Variant not found");
    if (variant.availableQuantity < quantity) throw new Error("Insufficient stock");

    const stock = await Stock.findByPk(variant.stock_id);

    variant.availableQuantity -= quantity;
    variant.onHoldQuantity += quantity;
    stock.availableQuantity -= quantity;
    stock.onHoldQuantity += quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  // Order cancelled/returned: Move from on-hold back to available
  async cancelOrder(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error("Variant not found");
    if (variant.onHoldQuantity < quantity) throw new Error("Insufficient on-hold stock");

    const stock = await Stock.findByPk(variant.stock_id);

    variant.onHoldQuantity -= quantity;
    variant.availableQuantity += quantity;
    stock.onHoldQuantity -= quantity;
    stock.availableQuantity += quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  // Order fulfilled: Move from on-hold to exhausted, reduce total
  async fulfillOrder(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error("Variant not found");
    if (variant.onHoldQuantity < quantity) throw new Error("Insufficient on-hold stock");

    const stock = await Stock.findByPk(variant.stock_id);

    variant.onHoldQuantity -= quantity;
    variant.exhaustedQuantity += quantity;
    variant.totalQuantity -= quantity;
    stock.onHoldQuantity -= quantity;
    stock.exhaustedQuantity += quantity;
    stock.totalQuantity -= quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  // Get available sizes and colors
  async getAvailableVariants(productId) {
    const stock = await Stock.findOne({ where: { productId } });
    if (!stock) return { sizes: [], colors: [] };

    const variants = await StockVariant.findAll({
      where: { stock_id: stock.stock_id, availableQuantity: { [Op.gt]: 0 } },
    });
    const sizes = [...new Set(variants.map(v => v.size))];
    const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];
    return { sizes, colors };
  }

  // Get stock totals
  async getProductStockTotals(productId) {
    const stock = await Stock.findOne({ where: { productId } });
    if (!stock) return {
      totalQuantity: 0,
      availableQuantity: 0,
      onHoldQuantity: 0,
      exhaustedQuantity: 0,
    };
    return {
      totalQuantity: stock.totalQuantity,
      availableQuantity: stock.availableQuantity,
      onHoldQuantity: stock.onHoldQuantity,
      exhaustedQuantity: stock.exhaustedQuantity,
    };
  }

  

  // Get stock by product ID
  async getStockByProductId(productId) {
    const stock = await Stock.findOne({
      where: { productId },
      include: [StockVariant],
    });
    if (!stock) return null;

    const totals = await this.getProductStockTotals(productId);
    const availableVariants = await this.getAvailableVariants(productId);

    return {
      ...stock.toJSON(),
      totals,
      availableVariants,
    };
  }
// Restock variant
  async restockVariant(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error("Variant not found");

    const stock = await Stock.findByPk(variant.stock_id);

    variant.totalQuantity += quantity;
    variant.availableQuantity += quantity;
    stock.totalQuantity += quantity;
    stock.availableQuantity += quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  // Get all stocks
  async getAllStocks() {
    const stocks = await Stock.findAll({
      include: [StockVariant],
    });
    return stocks.map(stock => ({
      ...stock.toJSON(),
      totals: {
        totalQuantity: stock.totalQuantity,
        availableQuantity: stock.availableQuantity,
        onHoldQuantity: stock.onHoldQuantity,
        exhaustedQuantity: stock.exhaustedQuantity,
      },
      availableVariants: {
        sizes: [...new Set(stock.StockVariants.map(v => v.size))].filter(v => 
          stock.StockVariants.some(sv => sv.size === v && sv.availableQuantity > 0)
        ),
        colors: [...new Set(stock.StockVariants.map(v => v.color).filter(Boolean))].filter(c => 
          stock.StockVariants.some(sv => sv.color === c && sv.availableQuantity > 0)
        ),
      },
    }));
  }
}

module.exports = new StockService();