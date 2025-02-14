const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");
const StandardProduct = require("../models/standardProduct.model");


/**
 * Add a product to the wishlist
 */
const addToWishlist = async (userId, productId, standardProductId) => {
  return await Wishlist.create({ user_id: userId, product_id: productId, standard_product_id: standardProductId });
};

/**
 * Remove a product from the wishlist
 */
const removeFromWishlist = async (userId, productId, standardProductId) => {
  return await Wishlist.destroy({
    where: { user_id: userId, product_id: productId || null, standard_product_id: standardProductId || null },
  });
};

/**
 * Get all wishlist items for a user
 */
const getWishlistByUser = async (userId) => {
  return await Wishlist.findAll({
    where: { user_id: userId },
    include: [
      { model: Product, as: "product" },
      { model: StandardProduct, as: "standardProduct" },
    ],
  });
};

/**
 * Check if a product exists in the user's wishlist
 */
const isProductInWishlist = async (userId, productId, standardProductId) => {
  return await Wishlist.findOne({
    where: { user_id: userId, product_id: productId || null, standard_product_id: standardProductId || null },
  });
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlistByUser,
  isProductInWishlist,
};
