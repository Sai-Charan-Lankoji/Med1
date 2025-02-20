// services/consignmentService.js
const Consignment = require("../models/consignment.model");
const ConsignmentDetail = require("../models/consignmentDetails.model");
const StockTransaction = require("../models/stockTransaction.model");
const StandardProduct = require("../models/standardProduct.model");
const { sequelize } = require("../config/db");

/**
 * Create a new consignment and update stock
 * @param {Object} data - Consignment data including items
 * @returns {Object} - Created consignment details
 * @throws {Error} - If validation or creation fails
 */
const createConsignment = async (data) => {
  const { consignment_number, supplier_id, transporter_id, date, items } = data;
  const transaction = await sequelize.transaction();

  try {
    // Validation
    if (!consignment_number || !supplier_id || !transporter_id || !date || !items || !Array.isArray(items)) {
      throw new Error("VALIDATION_ERROR: All fields (consignment_number, supplier_id, transporter_id, date, items) are required");
    }

    // Check if consignment number exists
    const existingConsignment = await Consignment.findByPk(consignment_number);
    if (existingConsignment) {
      throw new Error("RESOURCE_EXISTS: Consignment number already exists");
    }

    // Create consignment
    const consignment = await Consignment.create(
      {
        ConsignmentNumber: consignment_number,
        SupplierID: supplier_id,
        TransporterID: transporter_id,
        Date: date,
      },
      { transaction }
    );

    const consignmentDetails = [];
    for (const item of items) {
      const { product_id, size, color, quantity, purchased_price, selling_price } = item;

      if (!product_id || !quantity || !purchased_price || !selling_price) {
        throw new Error("VALIDATION_ERROR: Each item must have product_id, quantity, purchased_price, and selling_price");
      }

      // Verify product exists and validate variants
      const product = await StandardProduct.findByPk(product_id);
      if (!product) {
        throw new Error(`NOT_FOUND: Product with ID ${product_id} does not exist`);
      }
      if (size && !product.sizes.includes(size)) {
        throw new Error(`VALIDATION_ERROR: Size ${size} is not available for product ${product_id}`);
      }
      if (color && !product.colors.includes(color)) {
        throw new Error(`VALIDATION_ERROR: Color ${color} is not available for product ${product_id}`);
      }

      // Create consignment detail
      const detail = await ConsignmentDetail.create(
        {
          ConsignmentNumber: consignment_number,
          ProductID: product_id,
          Size: size,
          Color: color,
          Quantity: quantity,
        },
        { transaction }
      );

      // Create stock transaction
      await StockTransaction.create(
        {
          ProductID: product_id,
          Size: size,
          Color: color,
          Quantity: quantity,
          PurchasedPrice: purchased_price,
          SellingPrice: selling_price,
          Date: date,
          Type: "Receive",
          Reference: consignment_number,
        },
        { transaction }
      );

      // Update product stock
      product.stock += quantity;
      await product.save({ transaction });

      consignmentDetails.push({
        consignment_detail_id: detail.ConsignmentDetailID,
        product_id: detail.ProductID,
        size: detail.Size,
        color: detail.Color,
        quantity: detail.Quantity,
      });
    }

    await transaction.commit();

    return {
      consignment_number: consignment.ConsignmentNumber,
      supplier_id: consignment.SupplierID,
      transporter_id: consignment.TransporterID,
      date: consignment.Date,
      items: consignmentDetails,
    };
  } catch (error) {
    await transaction.rollback();
    throw error; // Propagate error to controller
  }
};

/**
 * Get consignment by number
 * @param {string} number - Consignment number
 * @returns {Object} - Consignment details
 * @throws {Error} - If consignment not found
 */
const getConsignmentByNumber = async (number) => {
  const consignment = await Consignment.findByPk(number, {
    include: [{ model: ConsignmentDetail, as: "ConsignmentDetails" }],
  });

  if (!consignment) {
    throw new Error("NOT_FOUND: Consignment with this number does not exist");
  }

  return {
    consignment_number: consignment.ConsignmentNumber,
    supplier_id: consignment.SupplierID,
    transporter_id: consignment.TransporterID,
    date: consignment.Date,
    items: consignment.ConsignmentDetails.map((d) => ({
      consignment_detail_id: d.ConsignmentDetailID,
      product_id: d.ProductID,
      size: d.Size,
      color: d.Color,
      quantity: d.Quantity,
    })),
  };
};

module.exports = { createConsignment, getConsignmentByNumber };