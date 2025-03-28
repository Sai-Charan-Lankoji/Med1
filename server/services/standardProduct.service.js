const StandardProduct = require("../models/standardProduct.model");
const Stock = require("../models/stock.model");
const StockVariant = require("../models/stockvariant.model");

// Create a new non-customized product
const createStandardProduct = async (data) => {
  return await StandardProduct.create(data);
};

// Get all standard products
const getAllStandardProducts = async () => {
  return await StandardProduct.findAll();
};

// Get all standard products by storeId
const getAllStandardProductsByStoreId = async (storeId) => {
  return await StandardProduct.findAll({
    where: { store_id: storeId.toString() },
    include: [
      {
        model: Stock,
        as: "Stock",
        include: [
          {
            model: StockVariant,
            as: "StockVariants",
          },
        ],
      },
    ],
  });
};

// Get all standard products by vendorId
const getAllStandardProductsByVendorId = async (vendorId) => {
  return await StandardProduct.findAll({
    where: { vendor_id: vendorId.toString() },
    include: [
      {
        model: Stock,
        as: "Stock",
        include: [
          {
            model: StockVariant,
            as: "StockVariants",
          },
        ],
      },
    ],
  });
};

// Get a single standard product by ID
const getStandardProductById = async (productId) => {
  try {
    const product = await StandardProduct.findOne({
      where: {
        id: productId,
        deleted_at: null,
      },
      include: [
        {
          model: Stock,
          as: "Stock",
          include: [
            {
              model: StockVariant,
              as: "StockVariants",
            },
          ],
        },
      ],
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Update a standard product
const updateStandardProduct = async (id, data) => {
  const product = await StandardProduct.findByPk(id);
  if (!product) return null;
  return await product.update(data);
};

// Delete a standard product
const deleteStandardProduct = async (id) => {
  const product = await StandardProduct.findByPk(id);
  if (!product) return null;
  return await product.destroy();
};

module.exports = {
  createStandardProduct,
  getAllStandardProducts,
  getAllStandardProductsByStoreId,
  getAllStandardProductsByVendorId,
  getStandardProductById,
  updateStandardProduct,
  deleteStandardProduct,
};