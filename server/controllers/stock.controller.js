const stockService = require("../services/stock.service");

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

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await stockService.getAllStocks();
    res.status(200).json({ success: true, stocks });
  } catch (error) {
    console.error("Error fetching all stocks:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getStockByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    const stock = await stockService.getStockByProductId(productId);
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: `Stock not found for productId: ${productId}`,
      });
    }

    res.status(200).json({ success: true, stock });
  } catch (error) {
    console.error("Error fetching stock by productId:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getStockVariantById = async (req, res) => {
  try {
    const { variantId } = req.params;
    if (!variantId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Variant ID is required",
      });
    }

    const stockVariant = await stockService.getStockVariantById(variantId);
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Stock variant retrieved successfully",
      data: stockVariant,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        details: error.message,
      },
    });
  }
}

module.exports = exports;