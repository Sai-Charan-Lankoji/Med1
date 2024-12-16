const  Product  = require('../models/product.model');
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

class ProductService {
  async createProduct(productData) {
    if (!productData.vendor_id) {
      throw new Error("Vendor ID is required to create a product.");
    }
    const productId = generateEntityId("product");

    const newProduct = new Product({id: productId, ...productData});
    return await newProduct.save();
  }

  async getProductById(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found.");
    }
    return product;
  }

  async updateProduct(productId, updateData) {
    const product = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
    });
    if (!product) {
      throw new Error("Product not found.");
    }
    return product;
  }

  async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new Error("Product not found.");
    }
  }

  async listAllProducts() {
    return await Product.findAll();
  }

  async retrieveByVendorId(vendorId) {
    return await Product.findAll({where: { vendor_id: vendorId }});
  }

  async retrieveByStoreId(storeId) {
    return await Product.findAll({ where: { store_id: storeId } });
  }

}

module.exports = new ProductService();
