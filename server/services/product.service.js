const  Product  = require('../models/product.model');

class ProductService {
  async createProduct(productData) {
    if (!productData.vendor_id) {
      throw new Error("Vendor ID is required to create a product.");
    }

    const newProduct = new Product(productData);
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
    return await Product.find();
  }

  async retrieveByVendorId(vendorId) {
    return await Product.findAll({where: { vendor_id: vendorId }});
  }

  async retrieveByStoreId(storeId) {
    return await Product.find({ where: { store_id: storeId } });
  }

}

module.exports = new ProductService();
