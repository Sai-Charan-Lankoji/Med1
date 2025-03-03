const wishlistService = require("../services/wishlist.service");

exports.addToWishlist = async (req, res) => {
  try {
    const { product_id, standard_product_id } = req.body;
    const customer_id = req.user.id;
    if (!product_id && !standard_product_id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          details: "Either product_id or standard_product_id is required",
        },
      });
    }

    const exists = await wishlistService.isProductInWishlist(
      customer_id,
      product_id,
      standard_product_id
    );
    if (exists) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "Conflict detected",
        data: null,
        error: {
          code: "RESOURCE_EXISTS",
          details: "This item is already in your wishlist",
        },
      });
    }
    const wishlist_item = await wishlistService.addToWishlist(
      customer_id,
      product_id,
      standard_product_id
    );
    
    res.status(201).json({
      status: 201,
      success: true,
      message: "Resource created successfully",
      data: wishlist_item,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: {
        code: "SERVER_ERROR",
        details: error.message || "An unexpected error occurred",
      },
    });
  }
};
exports.removeFromWishlist = async (req, res) => {
  try {
    const { product_id, standard_product_id } = req.body;
    const customer_id = req.user.id;

    if (!product_id && !standard_product_id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          details: "Either product_id or standard_product_id is required",
        },
      });
    }

    const removed = await wishlistService.removeFromWishlist(
      customer_id,
      product_id,
      standard_product_id
    );
    if (!removed) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: {
          code: "NOT_FOUND",
          details: "Item not found in wishlist",
        },
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: null, // No content to return after removal
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: {
        code: "SERVER_ERROR",
        details: error.message || "An unexpected error occurred",
      },
    });
  }
};

exports.getWishlistByUser = async (req, res) => {
  try {
    const customer_id = req.user.id;
    const wishlist = await wishlistService.getWishlistByUser(customer_id);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: {
        code: "SERVER_ERROR",
        details: error.message || "An unexpected error occurred",
      },
    });
  }
};
