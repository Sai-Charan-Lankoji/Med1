const Stock = require("../models/stock.model");
const StockVariant = require("../models/stockvariant.model");
const StandardProduct = require("../models/standardProduct.model");
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

    const variantEntries = variants.map((v) => ({
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

  // Get stock by stock_id (replacing getStockByProductId)
  async getStockByStockId(stockId) {
    const stock = await Stock.findOne({
      where: { stock_id: stockId },
      include: [StockVariant],
    });
    if (!stock) return null;

    const totals = {
      totalQuantity: stock.totalQuantity,
      availableQuantity: stock.availableQuantity,
      onHoldQuantity: stock.onHoldQuantity,
      exhaustedQuantity: stock.exhaustedQuantity,
    };

    const variants = stock.StockVariants || [];
    const availableVariants = {
      sizes: [...new Set(variants.map((v) => v.size))].filter((size) =>
        variants.some((sv) => sv.size === size && sv.availableQuantity > 0)
      ),
      colors: [...new Set(variants.map((v) => v.color).filter(Boolean))].filter((color) =>
        variants.some((sv) => sv.color === color && sv.availableQuantity > 0)
      ),
    };

    return {
      ...stock.toJSON(),
      totals,
      availableVariants,
    };
  }

  // Get available variants by stock_id
  async getAvailableVariants(stockId) {
    const stock = await Stock.findOne({ where: { stock_id: stockId } });
    if (!stock) return { sizes: [], colors: [] };

    const variants = await StockVariant.findAll({
      where: { stock_id: stock.stock_id, availableQuantity: { [Op.gt]: 0 } },
    });
    const sizes = [...new Set(variants.map((v) => v.size))];
    const colors = [...new Set(variants.map((v) => v.color).filter(Boolean))];
    return { sizes, colors };
  }

  // Get stock totals by stock_id
  async getProductStockTotals(stockId) {
    const stock = await Stock.findOne({ where: { stock_id: stockId } });
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
    return stocks.map((stock) => ({
      ...stock.toJSON(),
      totals: {
        totalQuantity: stock.totalQuantity,
        availableQuantity: stock.availableQuantity,
        onHoldQuantity: stock.onHoldQuantity,
        exhaustedQuantity: stock.exhaustedQuantity,
      },
      availableVariants: {
        sizes: [...new Set(stock.StockVariants.map((v) => v.size))].filter((v) =>
          stock.StockVariants.some((sv) => sv.size === v && sv.availableQuantity > 0)
        ),
        colors: [...new Set(stock.StockVariants.map((v) => v.color).filter(Boolean))].filter((c) =>
          stock.StockVariants.some((sv) => sv.color === c && sv.availableQuantity > 0)
        ),
      },
    }));
  }
}

module.exports = new StockService();