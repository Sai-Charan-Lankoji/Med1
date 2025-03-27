const standardProductService = require("../services/standardProduct.service");
const stockService = require("../services/stock.service");
const FileService = require("../utils/fileupload");

const fileService = new FileService();

/**
 * Create a new standard product with base64 image uploads.
 */
exports.createStandardProduct = async (req, res) => {
  try {
    await fileService.createUploadDirectory();

    const productData = {
      title: req.body.title,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      stock_id: req.body.stockId, // Map stockId to stock_id
      brand: req.body.brand,
      sku: req.body.sku,
      discount: parseInt(req.body.discount) || 0,
      customizable: req.body.customizable === "true" || req.body.customizable === true,
      sale: req.body.sale === "true" || req.body.sale === true,
      store_id: req.body.store_id,
      vendor_id: req.body.vendor_id, // Make sure this is included
      product_type: "Standard",
    };

    let uploadedImages = {};
    const imageFields = ["front_image", "back_image", "left_image", "right_image"];
    for (const field of imageFields) {
      if (req.body[field]) {
        try {
          const image = await fileService.saveBase64File(req.body[field], req);
          uploadedImages[field] = image.url;
        } catch (error) {
          console.error(`Error uploading ${field}:`, error);
        }
      }
    }

    const finalProductData = { ...productData, ...uploadedImages };
    const product = await standardProductService.createStandardProduct(finalProductData);

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * List all standard products.
 */
exports.getAllStandardProducts = async (req, res) => {
  try {
    const products = await standardProductService.getAllStandardProducts();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Retrieve a standard product by ID.
 */
exports.getStandardProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await standardProductService.getStandardProductById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Update a standard product by ID (including images).
 */
exports.updateStandardProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await standardProductService.getStandardProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const uploadedImages = {};
    const imageFields = ["front_image", "back_image", "left_image", "right_image"];
    for (const field of imageFields) {
      if (req.files && req.files[field]) {
        const file = req.files[field][0];
        await fileService.validateFile(file);
        const savedFile = await fileService.saveFile(file);
        uploadedImages[field] = fileService.generateFileUrl(req, savedFile.filename);

        if (existingProduct[field]) {
          await fileService.deleteFile(existingProduct[field]);
        }
      }
    }

    const updatedProduct = await standardProductService.updateStandardProduct(id, {
      ...req.body,
      ...uploadedImages,
    });

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Delete a standard product by ID (including images).
 */
exports.deleteStandardProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await standardProductService.getStandardProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const imageFields = ["front_image", "back_image", "left_image", "right_image"];
    for (const field of imageFields) {
      if (existingProduct[field]) {
        await fileService.deleteFile(existingProduct[field]);
      }
    }

    await standardProductService.deleteStandardProduct(id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * List standard products by storeId.
 */
exports.getAllStandardProductsByStoreId = async (req, res) => {
  const storeId = req.params.storeId;

  try {
    if (!storeId) {
      return res.status(400).json({ success: false, message: "Store ID is required" });
    }

    const products = await standardProductService.getAllStandardProductsByStoreId(storeId.toString());

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching standard products:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * List standard products by vendorId.
 */
exports.getAllStandardProductsByVendorId = async (req, res) => {
  const vendorId = req.params.vendorId;

  try {
    if (!vendorId) {
      return res.status(400).json({ success: false, message: "Vendor ID is required" });
    }

    const products = await standardProductService.getAllStandardProductsByVendorId(vendorId.toString());

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching standard products by vendor:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = exports;