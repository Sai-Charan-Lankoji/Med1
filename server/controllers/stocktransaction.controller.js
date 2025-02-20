// controllers/stockTransactionController.js
const stockTransactionService = require("../services/stocktransaction.service");

/**
 * Get stock transactions for a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStockTransactionsByProduct = async (req, res) => {
  try {
    const transactions = await stockTransactionService.getStockTransactionsByProduct(req.params.product_id);
    if (!transactions.length) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "No content available",
        data: [],
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching stock transactions:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: "An unexpected error occurred" },
    });
  }
};

module.exports = { getStockTransactionsByProduct };