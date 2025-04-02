const StandardProduct = require("../models/standardProduct.model");
const Stock = require("../models/stock.model");
const StockVariant = require("../models/stockvariant.model");


// Helper function to convert relative paths to full URLs
const addFullImageUrls = (product, req) => {
  if (!product) return product;

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.PRODUCTION_URL || 'https://med1-wyou.onrender.com'
    : `${req.protocol}://${req.get('host')}`;

  const imageFields = ['front_image', 'back_image', 'left_image', 'right_image'];
  
  // Process a single product
  const processProduct = (item) => {
    // Convert Sequelize model to plain object if needed
    const result = item.toJSON ? item.toJSON() : { ...item };
    
    // Add image URLs with full host for main product fields only
    imageFields.forEach(field => {
      if (result[field]) {
        if (result[field].startsWith('/uploads/')) {
          // For relative paths, add the base URL
          result[`${field}`] = `${baseUrl}${result[field]}`;
        } else if (result[field].startsWith('http://') || result[field].startsWith('https://')) {
          // For absolute URLs, use as is
          result[`${field}`] = result[field];
        }
      }
    });
    
    // Add a timestamp parameter to force image refresh if needed
    // This can help with browser caching issues
    if (process.env.FORCE_IMAGE_REFRESH === 'true') {
      imageFields.forEach(field => {
        if (result[`${field}`]) {
          result[`${field}`] += `?t=${Date.now()}`;
        }
      });
    }
    
    return result;
  };
  
  // If it's a single product (object)
  if (!Array.isArray(product)) {
    return processProduct(product);
  }
  
  // If it's an array of products
  return product.map(item => processProduct(item));
};

// Create a new non-customized product
const createStandardProduct = async (data) => {
  return await StandardProduct.create(data);
};

// Get all standard products with full image URLs
const getAllStandardProducts = async (req) => {
  const products = await StandardProduct.findAll();
  return addFullImageUrls(products, req);
};

// Get all standard products by storeId with full image URLs
const getAllStandardProductsByStoreId = async (storeId, req) => {
  const products = await StandardProduct.findAll({
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
  
  return addFullImageUrls(products, req);
};

// Get all standard products by vendorId with full image URLs
const getAllStandardProductsByVendorId = async (vendorId, req) => {
  const products = await StandardProduct.findAll({
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
  
  return addFullImageUrls(products, req);
};

// Get available products by vendorId with full image URLs
const getAvailableProductsByVendorId = async (vendorId, req) => {
  const products = await StandardProduct.findAll({
    where: { 
      vendor_id: vendorId.toString(),
      stock_id: null  // Only get products that are not associated with stock
    }
  });
  
  return addFullImageUrls(products, req);
};

// Get a single standard product by ID with full image URLs
const getStandardProductById = async (productId, req) => {
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

    return addFullImageUrls(product, req);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Update a standard product
const updateStandardProduct = async (id, data, req) => {
  const product = await StandardProduct.findByPk(id);
  if (!product) return null;
  
  const updatedProduct = await product.update(data);
  return addFullImageUrls(updatedProduct, req);
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
  getAvailableProductsByVendorId,
  getStandardProductById,
  updateStandardProduct,
  deleteStandardProduct,
};