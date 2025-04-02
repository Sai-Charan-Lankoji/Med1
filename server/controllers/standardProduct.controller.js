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

    // Log incoming data for debugging
    console.log("Incoming product data:", req.body);

    // Parse sizes and colors if they are strings
    let sizes = req.body.sizes;
    let colors = req.body.colors;
    
    // If sizes is a string, try to parse it
    if (typeof sizes === 'string') {
      try {
        sizes = JSON.parse(sizes);
      } catch (e) {
        console.error("Error parsing sizes:", e);
        sizes = sizes.split(',').map(s => s.trim());
      }
    }
    
    // If colors is a string, try to parse it
    if (typeof colors === 'string') {
      try {
        colors = JSON.parse(colors);
      } catch (e) {
        console.error("Error parsing colors:", e);
        colors = [];
      }
    }
    
    // Transform colors from [{ value, label }] to the format expected by your model
    const transformedColors = Array.isArray(colors) 
      ? colors.map(c => typeof c === 'object' ? { 
          name: c.label || c.value || c.name || '', 
          hex: c.hex || '#000000',
          inStock: true
        } : c)
      : colors;

    const productData = {
      title: req.body.title,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      sizes: sizes,
      colors: transformedColors,
      stock_id: req.body.stock_id || req.body.stockId, // Support both formats
      brand: req.body.brand,
      sku: req.body.sku,
      discount: parseInt(req.body.discount) || 0,
      customizable: req.body.customizable === "true" || req.body.customizable === true,
      sale: req.body.sale === "true" || req.body.sale === true,
      store_id: req.body.store_id,
      vendor_id: req.body.vendor_id,
      product_type: req.body.product_type || "Standard",
    };

    // For the image fields, use directly what the frontend provides if it starts with /uploads/
    const imageFields = ["front_image", "back_image", "left_image", "right_image"];
    for (const field of imageFields) {
      if (req.body[field]) {
        // If path already starts with /uploads/, use it directly
        if (req.body[field].startsWith('/uploads/')) {
          productData[field] = req.body[field];
        } 
        // Otherwise try to save as base64
        else {
          try {
            const image = await fileService.saveBase64File(req.body[field], req);
            productData[field] = image.url;
          } catch (error) {
            console.error(`Error uploading ${field}:`, error);
          }
        }
      }
    }

    console.log("Final product data:", productData);
    const product = await standardProductService.createStandardProduct(productData);

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
    const products = await standardProductService.getAllStandardProducts(req);
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
    console.log(`Fetching product with ID: ${id}`);

    const product = await standardProductService.getStandardProductById(id, req);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if URLs were added
    const imageFields = ['front_image', 'back_image', 'left_image', 'right_image'];
    let hasUrls = false;
    for (const field of imageFields) {
      if (product[`${field}_url`]) {
        hasUrls = true;
        break;
      }
    }
    
    if (!hasUrls) {
      console.warn("Image URLs weren't added to the product response");
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
    }, req);

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

    const products = await standardProductService.getAllStandardProductsByStoreId(storeId.toString(), req);

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

    const products = await standardProductService.getAllStandardProductsByVendorId(vendorId.toString(), req);

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching standard products by vendor:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * List available standard products (not linked to stock) by vendorId.
 */
exports.getAvailableProductsByVendorId = async (req, res) => {
  const vendorId = req.params.vendorId;

  try {
    if (!vendorId) {
      return res.status(400).json({ success: false, message: "Vendor ID is required" });
    }

    const products = await standardProductService.getAvailableProductsByVendorId(vendorId.toString(), req);

    res.status(200).json({ 
      success: true, 
      count: products.length,
      products 
    });
  } catch (error) {
    console.error("Error fetching available standard products by vendor:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = exports;