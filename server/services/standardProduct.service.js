const StandardProduct = require("../models/standardProduct.model") 

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
  return await StandardProduct.findAll({where : {store_id : storeId}});
};

// Get a single standard product by ID
const getStandardProductById = async (id) => {
  return await StandardProduct.findByPk(id);
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
  getStandardProductById,
  updateStandardProduct,
  deleteStandardProduct,
};
