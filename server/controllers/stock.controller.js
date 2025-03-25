const stockService = require("../services/stock.service");

/**
 * Create a new stock entry with variants
 */
exports.createStock = async (req, res) => {
  try {
    const { title, category, stockType, productId, hsnCode, gstPercentage, variants } = req.body;

    if (!title || !category || !stockType || !hsnCode || !gstPercentage || !variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title, category, stockType, hsnCode, gstPercentage, and variants array are required",
      });
    }
    if (stockType === "Standard" && !productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required for Standard stock type",
      });
    }

    const stockData = {
      title,
      category,
      stockType,
      productId,
      hsnCode,
      gstPercentage,
      variants: variants.map((v) => ({
        size: v.size,
        color: v.color,
        totalQuantity: parseInt(v.totalQuantity),
      })),
    };

    const stock = await stockService.createStock(stockData);
    res.status(201).json({ success: true, stock });
  } catch (error) {
    console.error("Error creating stock:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Place an order (move to on-hold)
 */
exports.placeOrder = async (req, res) => {
  try {
    const { variantId, quantity } = req.body;

    if (!variantId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "variantId and valid quantity are required" });
    }

    const variant = await stockService.placeOrder(variantId, parseInt(quantity));
    res.status(200).json({ success: true, variant });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Cancel an order (move back to available)
 */
exports.cancelOrder = async (req, res) => {
  try {
    const { variantId, quantity } = req.body;

    if (!variantId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "variantId and valid quantity are required" });
    }

    const variant = await stockService.cancelOrder(variantId, parseInt(quantity));
    res.status(200).json({ success: true, variant });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Fulfill an order (move to exhausted)
 */
exports.fulfillOrder = async (req, res) => {
  try {
    const { variantId, quantity } = req.body;

    if (!variantId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "variantId and valid quantity are required" });
    }

    const variant = await stockService.fulfillOrder(variantId, parseInt(quantity));
    res.status(200).json({ success: true, variant });
  } catch (error) {
    console.error("Error fulfilling order:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Restock a variant
 */
exports.restockVariant = async (req, res) => {
  try {
    const { variantId, quantity } = req.body;

    if (!variantId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "variantId and valid quantity are required" });
    }

    const variant = await stockService.restockVariant(variantId, parseInt(quantity));
    res.status(200).json({ success: true, variant });
  } catch (error) {
    console.error("Error restocking variant:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get all stock entries
 */
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await stockService.getAllStocks();
    res.status(200).json({ success: true, stocks });
  } catch (error) {
    console.error("Error fetching all stocks:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = exports;