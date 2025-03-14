// backend/services/wishlist.service.js
const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");
const StandardProduct = require("../models/standardProduct.model");
const sequelize = require("../config/db");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const addToWishlist = async (customerId, productId, standardProductId) => {
  if (!productId && !standardProductId) {
    throw new Error("Either productId or standardProductId is required");
  }

  const transaction = await sequelize.transaction();
  try {
    // Validate product existence
    if (productId) {
      const product = await Product.findByPk(productId, { transaction });
      if (!product) {
        throw new Error("Product not found");
      }
    }
    if (standardProductId) {
      const standardProduct = await StandardProduct.findByPk(
        standardProductId,
        { transaction }
      );
      if (!standardProduct) {
        throw new Error("Standard product not found");
      }
    }

    // Create wishlist item (allow duplicates)
    const wishlistItem = await Wishlist.create(
      {
        customer_id: customerId,
        product_id: productId || null,
        standard_product_id: standardProductId || null,
        quantity: 1, // Default quantity
      },
      { transaction }
    );

    cache.del(`wishlist_${customerId}`);
    await transaction.commit();
    return wishlistItem;
  } catch (error) {
    await transaction.rollback();
    console.error("Error in addToWishlist:", error);
    throw error;
  }
};

const removeFromWishlist = async (customerId, productId, standardProductId) => {
  if (!productId && !standardProductId) {
    throw new Error("Either productId or standardProductId is required");
  }

  const result = await Wishlist.destroy({
    where: {
      customer_id: customerId,
      product_id: productId || null,
      standard_product_id: standardProductId || null,
    },
    limit: 1, // Remove only one instance if duplicates exist
  });

  if (result) cache.del(`wishlist_${customerId}`);
  return result > 0;
};

const getWishlistByUser = async (customerId) => {
  const cacheKey = `wishlist_${customerId}`;
  const cached = cache.get(cacheKey);

  if (cached) return cached;

  const wishlist = await Wishlist.findAll({
    where: { customer_id: customerId },
  });

  cache.set(cacheKey, wishlist);
  return wishlist;
};

const isProductInWishlist = async (
  customerId,
  productId,
  standardProductId
) => {
  const item = await Wishlist.findOne({
    where: {
      customer_id: customerId,
      product_id: productId || null,
      standard_product_id: standardProductId || null,
    },
  });

  return !!item;
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlistByUser,
  isProductInWishlist,
};
