const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");
const StandardProduct = require("../models/standardProduct.model");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const addToWishlist = async (customerId, productId, standardProductId) => {
  if (productId) {
    const product = await Product.findByPk(productId);
    if (!product) throw new Error("Product not found");
  }
  if (standardProductId) {
    const standardProduct = await StandardProduct.findByPk(standardProductId);
    if (!standardProduct) throw new Error("Standard product not found");
  }

  const wishlistItem = await Wishlist.create({
    customer_id: customerId,
    product_id: productId || null,
    standard_product_id: standardProductId || null,
  });
  cache.del(`wishlist_${customerId}`);
  return wishlistItem;
};

const removeFromWishlist = async (customerId, productId, standardProductId) => {
  const result = await Wishlist.destroy({
    where: {
      customer_id: customerId,
      product_id: productId || null,
      standard_product_id: standardProductId || null,
    },
  });

  if (result) cache.del(`wishlist_${customerId}`);
  return result > 0;
};

const getWishlistByUser = async (customerId) => {
  const cacheKey = `wishlist_${customerId}`;
  const cached = cache.get(cacheKey);

  if (cached) return cached;

  const wishlist = await Wishlist.findAll({
    where: { customer_id: customerId }
  });


  cache.set(cacheKey, wishlist);
  return wishlist;
};

const isProductInWishlist = async (customerId, productId, standardProductId) => {
  return await Wishlist.findOne({
    where: {
      customer_id: customerId,
      product_id: productId || null,
      standard_product_id: standardProductId || null,
    },
  });
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlistByUser,
  isProductInWishlist,
};