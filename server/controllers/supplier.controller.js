// controllers/supplierController.js
const supplierService = require("../services/supplier.service");

/**
 * Create a new supplier
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    return res.status(201).json({
      status: 201,
      success: true,
      message: "Resource created successfully",
      data: supplier,
    });
  } catch (error) {
    console.error("Error creating supplier:", error.message);
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
 * Get all suppliers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: suppliers,
    });
  } catch (error) {
    console.error("Error fetching suppliers:", error.message);
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
 * Get supplier by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSupplierById = async (req, res) => {
  try {
    const supplier = await supplierService.getSupplierById(req.params.id);
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: supplier,
    });
  } catch (error) {
    console.error("Error fetching supplier:", error.message);
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

module.exports = { createSupplier, getAllSuppliers, getSupplierById };