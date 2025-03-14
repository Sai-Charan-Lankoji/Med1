const productService = require('../services/product.service');

class ProductController {
  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProduct(req, res) {
    try {
      let product = await productService.getProductById(req.params.id);
  
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
  
      // Extract dataValues from the Sequelize model instance
      const productData = product.dataValues ? product.dataValues : product;
  
      // Remove designstate, propstate, and other unwanted fields from the product data
      const { designstate, propstate, _previousDataValues, ...filteredProduct } = productData;
  
      // Remove jsonDesign from each design object, if designs exist
      if (filteredProduct.designs) {
        filteredProduct.designs = filteredProduct.designs.map(design => {
          // Handle case where design might also be a Sequelize instance
          const designData = design.dataValues ? design.dataValues : design;
          const { jsonDesign, ...rest } = designData;
          return rest;
        });
      }
  
      // Send the filtered product in the response with the expected structure
      res.status(200).json({
        success: true,
        product: filteredProduct
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred while retrieving the product",
        error: error.message
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async listProducts(req, res) {
    try {
      const { vendor_id, store_id } = req.query;
      let products;

      if (vendor_id) {
        products = await productService.retrieveByVendorId(vendor_id);
      } else if (store_id) {
        products = await productService.retrieveByStoreId(store_id);
      } else {
        products = await productService.listAllProducts();
      }

      res.status(200).json(products);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async retrieveByVendorId(req, res) {
    try {
      const products = await productService.retrieveByVendorId(req.params.vendor_id);
      res.status(200).json(products);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async retrieveByStoreId(req, res) {
    try {
      const products = await productService.retrieveByStoreId(req.params.store_id);
      res.status(200).json({products: products});
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
