// controllers/consignmentController.js
const consignmentService = require("../services/consignment.service");

/**
 * Create a new consignment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createConsignment = async (req, res) => {
  try {
    const consignment = await consignmentService.createConsignment(req.body);
    return res.status(201).json({
      status: 201,
      success: true,
      message: "Resource created successfully",
      data: consignment,
    });
  } catch (error) {
    console.error("Error creating consignment:", error.message);
    const [code, details] = error.message.split(": ");
    switch (code) {
      case "VALIDATION_ERROR":
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Invalid request parameters",
          data: null,
          error: { code, details },
        });
      case "RESOURCE_EXISTS":
        return res.status(409).json({
          status: 409,
          success: false,
          message: "Conflict detected",
          data: null,
          error: { code, details },
        });
      case "NOT_FOUND":
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Resource not found",
          data: null,
          error: { code, details },
        });
      default:
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Internal Server Error",
          data: null,
          error: { code: "SERVER_ERROR", details: "An unexpected error occurred" },
        });
    }
  }
};

/**
 * Get consignment by number
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getConsignmentByNumber = async (req, res) => {
  try {
    const consignment = await consignmentService.getConsignmentByNumber(req.params.number);
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: consignment,
    });
  } catch (error) {
    console.error("Error fetching consignment:", error.message);
    const [code, details] = error.message.split(": ");
    if (code === "NOT_FOUND") {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code, details },
      });
    }
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: "An unexpected error occurred" },
    });
  }
};

module.exports = { createConsignment, getConsignmentByNumber };