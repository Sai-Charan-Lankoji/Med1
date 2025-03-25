// services/stock.service.js
const Stock = require("../models/stock.model");
const StockVariant = require("../models/stockvariant.model");
const StandardProduct = require("../models/standardProduct.model");
const { Op } = require("sequelize");

class StockService {
  // Create stock with variants
  async createStock({ title, category, stockType, productId, hsnCode, gstPercentage, variants }) {
    // Validate required fields
    if (!title || !category || !stockType || !hsnCode || !gstPercentage || !variants || !Array.isArray(variants) || variants.length === 0) {
      throw new Error("All fields (title, category, stockType, hsnCode, gstPercentage, variants) are required");
    }
    if (stockType === "Standard" && !productId) {
      throw new Error("Product ID is required for Standard stock type");
    }

    const totalQuantity = variants.reduce((sum, v) => sum + v.totalQuantity, 0);
    const availableQuantity = totalQuantity;

    const stock = await Stock.create({
      title,
      category,
      stockType,
      productId: stockType === "Standard" ? productId : null, // Set null for Designable
      hsnCode,
      gstPercentage,
      totalQuantity,
      availableQuantity,
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
  // Order placed: Move from available to on-hold
  async placeOrder(variantId, quantity, transaction) {
    const variant = await StockVariant.findByPk(variantId, { transaction });
    if (!variant) throw new Error(`Variant not found: ${variantId}`);

    if (variant.availableQuantity < quantity) {
      throw new Error(`Insufficient stock for variant ${variantId}: requested ${quantity}, available ${variant.availableQuantity}`);
    }

    const stock = await Stock.findByPk(variant.stock_id, { transaction });

    variant.availableQuantity -= quantity;
    variant.onHoldQuantity += quantity;
    stock.availableQuantity -= quantity;
    stock.onHoldQuantity += quantity;

    await Promise.all([variant.save({ transaction }), stock.save({ transaction })]);
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

  // Get stock by stock_id (Fixed alias issue)
  async getStockByStockId(stockId) {
    const stock = await Stock.findOne({
      where: { stock_id: stockId },
      include: [
        {
          model: StockVariant,
          as: "StockVariants", // Use the alias from defineRelationships
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

  // New method: Get stock variant by variantId
  async getStockVariantById(variantId) {
    const variant = await StockVariant.findByPk(variantId, {
      include: [
        {
          model: Stock,
          as: "Stock", // Include Stock for consistency
        },
      ],
    });
    if (!variant) return null;

    const stock = variant.Stock;
    const totals = stock
      ? {
          totalQuantity: stock.totalQuantity,
          availableQuantity: stock.availableQuantity,
          onHoldQuantity: stock.onHoldQuantity,
          exhaustedQuantity: stock.exhaustedQuantity,
        }
      : null;

    return {
      ...variant.toJSON(),
      stock: stock ? stock.toJSON() : null,
      totals,
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
      include: [
        {
          model: StockVariant,
          as: "StockVariants", // Consistent alias usage
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