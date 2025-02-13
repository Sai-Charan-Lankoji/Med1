const standardProductService = require("../services/standardProduct.service");
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
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : JSON.parse(req.body.sizes || "[]"),
      colors: Array.isArray(req.body.colors) ? req.body.colors : JSON.parse(req.body.colors || "[]"),
      stock: parseInt(req.body.stock),
      brand: req.body.brand,
      sku: req.body.sku,
      weight: parseFloat(req.body.weight),
      dimensions: typeof req.body.dimensions === "object"
        ? req.body.dimensions
        : JSON.parse(req.body.dimensions || '{"length": 0, "width": 0, "height": 0}'),
      is_customizable: req.body.is_customizable === "true" || req.body.is_customizable === true,
      is_discountable: req.body.is_discountable === "true" || req.body.is_discountable === true,
      store_id: req.body.store_id,
    };

    // Process side images (front, back, left, right)
    let uploadedImages = {};
    const imageFields = ["front_image", "back_image", "left_image", "right_image"];

    for (const field of imageFields) {
      if (req.body[field]) {
        try {
          const image = await fileService.saveBase64File(req.body[field], req);
          uploadedImages[field] = image.url; // Store full URL
        } catch (error) {
          console.error(`Error uploading ${field}:`, error);
        }
      }
    }

    // Merge the data
    const finalProductData = {
      ...productData,
      ...uploadedImages, // Store side-wise images with full URLs
    };

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
 * List standard products by storeId.
 */
exports.getAllStandardProductsByStoreId = async (req, res) => {
  const storeId = req.params.storeId;
  try {
    const products =
      await standardProductService.getAllStandardProductsByStoreId(storeId);
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
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Update a standard product by ID (including images).
 */
exports.updateStandardProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await standardProductService.getStandardProductById(
      id
    );
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Handle updated images
    const uploadedImages = {};
    const imageFields = [
      "front_image",
      "back_image",
      "left_image",
      "right_image",
    ];

    for (const field of imageFields) {
      if (req.files && req.files[field]) {
        const file = req.files[field][0];
        await fileService.validateFile(file);
        const savedFile = await fileService.saveFile(file);
        uploadedImages[field] = fileService.generateFileUrl(
          req,
          savedFile.filename
        );

        // Delete old image file if exists
        if (existingProduct[field]) {
          await fileService.deleteFile(existingProduct[field]);
        }
      }
    }

    // Merge request body with uploaded images
    const updatedProduct = await standardProductService.updateStandardProduct(
      id,
      {
        ...req.body,
        ...uploadedImages,
      }
    );

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
    const existingProduct = await standardProductService.getStandardProductById(
      id
    );
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete associated images
    const imageFields = [
      "front_image",
      "back_image",
      "left_image",
      "right_image",
    ];
    for (const field of imageFields) {
      if (existingProduct[field]) {
        await fileService.deleteFile(existingProduct[field]);
      }
    }

    await standardProductService.deleteStandardProduct(id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
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
 * List standard products by storeId.
 */
exports.getAllStandardProductsByStoreId = async (req, res) => {
  const storeId = req.params.storeId;
  try {
    const products =
      await standardProductService.getAllStandardProductsByStoreId(storeId);
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
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Update a standard product by ID (including images).
 */
exports.updateStandardProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await standardProductService.getStandardProductById(
      id
    );
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Handle updated images
    const uploadedImages = {};
    const imageFields = [
      "front_image",
      "back_image",
      "left_image",
      "right_image",
    ];

    for (const field of imageFields) {
      if (req.files && req.files[field]) {
        const file = req.files[field][0];
        await fileService.validateFile(file);
        const savedFile = await fileService.saveFile(file);
        uploadedImages[field] = fileService.generateFileUrl(
          req,
          savedFile.filename
        );

        // Delete old image file if exists
        if (existingProduct[field]) {
          await fileService.deleteFile(existingProduct[field]);
        }
      }
    }

    // Merge request body with uploaded images
    const updatedProduct = await standardProductService.updateStandardProduct(
      id,
      {
        ...req.body,
        ...uploadedImages,
      }
    );

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
    const existingProduct = await standardProductService.getStandardProductById(
      id
    );
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete associated images
    const imageFields = [
      "front_image",
      "back_image",
      "left_image",
      "right_image",
    ];
    for (const field of imageFields) {
      if (existingProduct[field]) {
        await fileService.deleteFile(existingProduct[field]);
      }
    }

    await standardProductService.deleteStandardProduct(id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
