const Stock = require("../models/stock.model");
const StockVariant = require("../models/stockvariant.model");

class StockService {
  async getStockByProductId(productId) {
    const stock = await Stock.findOne({
      where: { productId },
      include: [
        {
          model: StockVariant,
          as: "StockVariants",
        },
      ],
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

  async getStockVariantById(variantId) {
    try {
      const stockVariant = await StockVariant.findOne({
        where: { variantId },
        include: [{ model: require("../models/stock.model"), as: "stock" }],
      });

      if (!stockVariant) {
        throw new Error("Stock variant not found");
      }

      return stockVariant;
    } catch (error) {
      throw new Error(`Failed to fetch stock variant: ${error.message}`);
    }
  }

  async createStock({ title, category, stockType, productId, hsnCode, gstPercentage, variants }) {
    if (!title || !category || !stockType || !hsnCode || !gstPercentage || !variants || !Array.isArray(variants) || variants.length === 0) {
      throw new Error("All fields (title, category, stockType, hsnCode, gstPercentage, variants) are required");
    }
    if (stockType === "Standard" && !productId) {
      throw new Error("Product ID is required for Standard stock type");
    }

    const totalQuantity = variants.reduce((sum, v) => sum + v.totalQuantity, 0);

    const stock = await Stock.create({
      title,
      category,
      stockType,
      productId: stockType === "Standard" ? productId : null,
      hsnCode,
      gstPercentage,
      totalQuantity,
      availableQuantity: totalQuantity,
      onHoldQuantity: 0,
      exhaustedQuantity: 0,
    });

    const variantEntries = variants.map((v) => ({
      stockId: stock.stock_id,
      size: v.size,
      color: v.color,
      totalQuantity: v.totalQuantity,
      availableQuantity: v.totalQuantity,
      onHoldQuantity: 0,
      exhaustedQuantity: 0,
    }));

    await StockVariant.bulkCreate(variantEntries);

    return {
      ...stock.toJSON(),
      variants: variantEntries,
    };
  }

  async placeOrder(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error(`Variant not found: ${variantId}`);
    if (variant.availableQuantity < quantity) {
      throw new Error(`Insufficient stock for variant ${variantId}`);
    }

    const stock = await Stock.findByPk(variant.stockId);

    variant.availableQuantity -= quantity;
    variant.onHoldQuantity += quantity;
    stock.availableQuantity -= quantity;
    stock.onHoldQuantity += quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  async cancelOrder(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error("Variant not found");
    if (variant.onHoldQuantity < quantity) throw new Error("Insufficient on-hold stock");

    const stock = await Stock.findByPk(variant.stockId);

    variant.onHoldQuantity -= quantity;
    variant.availableQuantity += quantity;
    stock.onHoldQuantity -= quantity;
    stock.availableQuantity += quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  async fulfillOrder(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error("Variant not found");
    if (variant.onHoldQuantity < quantity) throw new Error("Insufficient on-hold stock");

    const stock = await Stock.findByPk(variant.stockId);

    variant.onHoldQuantity -= quantity;
    variant.exhaustedQuantity += quantity;
    variant.totalQuantity -= quantity;
    stock.onHoldQuantity -= quantity;
    stock.exhaustedQuantity += quantity;
    stock.totalQuantity -= quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  async restockVariant(variantId, quantity) {
    const variant = await StockVariant.findByPk(variantId);
    if (!variant) throw new Error("Variant not found");

    const stock = await Stock.findByPk(variant.stockId);

    variant.totalQuantity += quantity;
    variant.availableQuantity += quantity;
    stock.totalQuantity += quantity;
    stock.availableQuantity += quantity;

    await Promise.all([variant.save(), stock.save()]);
    return variant;
  }

  async getAllStocks() {
    const stocks = await Stock.findAll({
      include: [
        {
          model: StockVariant,
          as: "StockVariants",
        },
      ],
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
        sizes: [...new Set(stock.StockVariants.map((v) => v.size))].filter((size) =>
          stock.StockVariants.some((sv) => sv.size === size && sv.availableQuantity > 0)
        ),
        colors: [...new Set(stock.StockVariants.map((v) => v.color).filter(Boolean))].filter((color) =>
          stock.StockVariants.some((sv) => sv.color === color && sv.availableQuantity > 0)
        ),
      },
    }));
  }
}

module.exports = new StockService();