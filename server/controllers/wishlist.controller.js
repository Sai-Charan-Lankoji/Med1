const wishlistService = require("../services/wishlist.service");

/**
 * Add an item to the wishlist
 */
exports.addToWishlist = async (req, res) => {
  try {
    const { product_id, standard_product_id } = req.body;
    const user_id = req.user.id; // Assuming authentication middleware sets req.user

    if (!product_id && !standard_product_id) {
      return res.status(400).json({ success: false, message: "Either product_id or standard_product_id is required" });
    }

    // Check if already exists
    const exists = await wishlistService.isProductInWishlist(user_id, product_id, standard_product_id);
    if (exists) {
      return res.status(400).json({ success: false, message: "Product already in wishlist" });
    }

    const wishlistItem = await wishlistService.addToWishlist(user_id, product_id, standard_product_id);
    res.status(201).json({ success: true, wishlistItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Remove an item from the wishlist
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const { product_id, standard_product_id } = req.body;
    const user_id = req.user.id;

    if (!product_id && !standard_product_id) {
      return res.status(400).json({ success: false, message: "Either product_id or standard_product_id is required" });
    }

    await wishlistService.removeFromWishlist(user_id, product_id, standard_product_id);
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get all wishlist items for a user
 */
exports.getWishlistByUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const wishlist = await wishlistService.getWishlistByUser(user_id);
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
