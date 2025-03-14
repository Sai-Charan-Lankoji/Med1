// backend/controllers/wishlist.controller.js
const wishlistService = require('../services/wishlist.service');

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { product_id, standard_product_id } = req.body;
    const customer_id = req.user.id;
    // Input validation
    if (!product_id && !standard_product_id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid request parameters',
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          details: 'Either product_id or standard_product_id is required',
        },
      });
    }

    // Add to wishlist (no duplicate check needed)
    const wishlist_item = await wishlistService.addToWishlist(customer_id, product_id, standard_product_id);
    res.status(201).json({
      status: 201,
      success: true,
      message: 'Resource created successfully',
      data: wishlist_item,
    });
  } catch (error) {
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation error',
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          details: error.errors.map((err) => err.message).join(', '),
        },
      });
    }

    // Handle foreign key constraint errors
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid product reference',
        data: null,
        error: {
          code: 'FOREIGN_KEY_ERROR',
          details: 'The specified product_id or standard_product_id does not exist',
        },
      });
    }

    // Handle specific service errors
    if (error.message === 'Product not found' || error.message === 'Standard product not found') {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: {
          code: 'NOT_FOUND',
          details: error.message,
        },
      });
    }

    // Generic server error
    console.error('Error in addToWishlist:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: {
        code: 'SERVER_ERROR',
        details: error.message || 'An unexpected error occurred',
      },
    });
  }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { product_id, standard_product_id } = req.body;
    const customer_id = req.user.id;

    // Input validation
    if (!product_id && !standard_product_id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid request parameters',
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          details: 'Either product_id or standard_product_id is required',
        },
      });
    }

     

    // Remove from wishlist
    const removed = await wishlistService.removeFromWishlist(customer_id, product_id, standard_product_id);
    if (!removed) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Resource not found',
        data: null,
        error: {
          code: 'NOT_FOUND',
          details: 'Item not found in wishlist',
        },
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: null,
    });
  } catch (error) {
    // Handle Sequelize errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation error',
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          details: error.errors.map((err) => err.message).join(', '),
        },
      });
    }

    console.error('Error in removeFromWishlist:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: {
        code: 'SERVER_ERROR',
        details: error.message || 'An unexpected error occurred',
      },
    });
  }
};

// Get Wishlist by User
exports.getWishlistByUser = async (req, res) => {
  try {
    const customer_id = req.user.id;
    const wishlist = await wishlistService.getWishlistByUser(customer_id);

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Request successful',
      data: wishlist,
    });
  } catch (error) {
    console.error('Error in getWishlistByUser:', error);
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal Server Error',
      data: null,
      error: {
        code: 'SERVER_ERROR',
        details: error.message || 'An unexpected error occurred',
      },
    });
  }
};