// controllers/transporterController.js
const transporterService = require("../services/transport.service");

/**
 * Create a new transporter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createTransporter = async (req, res) => {
  try {
    const transporter = await transporterService.createTransporter(req.body);
    return res.status(201).json({
      status: 201,
      success: true,
      message: "Resource created successfully",
      data: transporter,
    });
  } catch (error) {
    console.error("Error creating transporter:", error.message);
    const [code, details] = error.message.split(": ");
    if (code === "VALIDATION_ERROR") {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
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

/**
 * Get all transporters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllTransporters = async (req, res) => {
  try {
    const transporters = await transporterService.getAllTransporters();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: transporters,
    });
  } catch (error) {
    console.error("Error fetching transporters:", error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: "An unexpected error occurred" },
    });
  }
};

/**
 * Get transporter by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTransporterById = async (req, res) => {
  try {
    const transporter = await transporterService.getTransporterById(req.params.id);
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: transporter,
    });
  } catch (error) {
    console.error("Error fetching transporter:", error.message);
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

module.exports = { createTransporter, getAllTransporters, getTransporterById };