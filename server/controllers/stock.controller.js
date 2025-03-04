// controllers/stock.controller.js


const stockService = require("../services/stock.service");

/**
 * Create a new stock entry with variants
 */
exports.createStock = async (req, res) => {
  try {
    const { title, variants } = req.body;

    if (!title || !variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ success: false, message: "Title and variants array are required" });
    }

    const stockData = {
      title,
      variants: variants.map(v => ({
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
 * Link stock to a product
 */
exports.linkStockToProduct = async (req, res) => {
  try {
    const { stockId, productId } = req.body;

    if (!stockId || !productId) {
      return res.status(400).json({ success: false, message: "stockId and productId are required" });
    }

    await stockService.linkStockToProduct(stockId, productId);
    res.status(200).json({ success: true, message: "Stock linked to product successfully" });
  } catch (error) {
    console.error("Error linking stock to product:", error);
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
 * Get stock details by product ID
 */
exports.getStockByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const stock = await stockService.getStockByProductId(productId);
    if (!stock) {
      return res.status(404).json({ success: false, message: "Stock not found for this product" });
    }

    res.status(200).json({ success: true, stock });
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};


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