const cartService = require("../services/cart.service");

/**
 * @desc Create a new cart item
 * @route POST /api/carts
 * @access Public
 */
const createCart = async (req, res) => {
  try {
    const cartItem = await cartService.createCart(req.body);
    res.status(201).json({
      status: 201,
      success: true,
      message: "Cart item added successfully",
      data: cartItem,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid request parameters",
      error: {
        code: "VALIDATION_ERROR",
        details: error.message,
      },
    });
  }
};

/**
 * @desc Retrieve a cart item by ID
 * @route GET /api/carts/:id
 * @access Public
 */
const getCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await cartService.getCartById(id);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Cart item retrieved successfully",
      data: cartItem,
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      success: false,
      message: "Cart item not found",
      error: {
        code: "NOT_FOUND",
        details: error.message,
      },
    });
  }
};

/**
 * @desc Update an existing cart item
 * @route PUT /api/carts/:id
 * @access Public
 */
const updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCart = await cartService.updateCart(id, req.body);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Cart item updated successfully",
      data: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: "Failed to update cart item",
      error: {
        code: "UPDATE_ERROR",
        details: error.message,
      },
    });
  }
};

/**
 * @desc Delete a cart item
 * @route DELETE /api/carts/:id
 * @access Public
 */
const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    await cartService.deleteCart(id);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Cart item deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      success: false,
      message: "Cart item not found",
      error: {
        code: "NOT_FOUND",
        details: error.message,
      },
    });
  }
};

/**
 * @desc Retrieve all cart items for a customer (Designable & Standard)
 * @route GET /api/carts/customer/:customerId
 * @access Public
 */
const getCartsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const cartData = await cartService.getCartByCustomer(customerId);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Cart items retrieved successfully",
      data: {
        designable_products: cartData.designable_products,
        standard_products: cartData.standard_products,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      success: false,
      message: "No cart items found for customer",
      error: {
        code: "NOT_FOUND",
        details: error.message,
      },
    });
  }
};

/**
 * @desc Clear all cart items for a customer
 * @route DELETE /api/carts/customer/:customerId
 * @access Public
 */
const clearCustomerCart = async (req, res) => {
  try {
    const { customerId } = req.params;
    await cartService.clearCustomerCart(customerId);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Customer cart cleared successfully",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: "Failed to clear cart",
      error: {
        code: "CLEAR_ERROR",
        details: error.message,
      },
    });
  }
};

/**
 * @desc Update cart quantity
 * @route PATCH /api/carts/:id/quantity
 * @access Public
 */
const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Quantity must be a positive number",
        error: {
          code: "VALIDATION_ERROR",
          details: "Invalid quantity value",
        },
      });
    }

    const updatedCart = await cartService.updateCartQuantity(id, quantity);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Cart quantity updated successfully",
      data: updatedCart,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: "Failed to update cart quantity",
      error: {
        code: "UPDATE_ERROR",
        details: error.message,
      },
    });
  }
};

module.exports = {
  createCart,
  getCart,
  updateCart,
  deleteCart,
  getCartsByCustomer,
  clearCustomerCart,
  updateCartQuantity,
};
