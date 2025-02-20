// services/stockTransactionService.js
const { StockTransaction } = require("../models/stockTransaction.model");

/**
 * Get stock transactions for a product
 * @param {string} product_id - Product UUID
 * @returns {Array} - List of stock transactions
 */
const getStockTransactionsByProduct = async (product_id) => {
  const transactions = await StockTransaction.findAll({
    where: { ProductID: product_id },
  });

  return transactions.map((t) => ({
    transaction_id: t.TransactionID,
    product_id: t.ProductID,
    size: t.Size,
    color: t.Color,
    quantity: t.Quantity,
    purchased_price: t.PurchasedPrice,
    selling_price: t.SellingPrice,
    date: t.Date,
    type: t.Type,
    reference: t.Reference,
  }));
};

module.exports = { getStockTransactionsByProduct };