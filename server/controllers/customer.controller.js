const customerService = require("../services/customer.service");
const FileService = require("../services/file.service");
const multer = require("multer");
const fileService = new FileService();
const upload = multer();

const signup = async (req, res) => {
  try {
    const { email, first_name, last_name, password, phone, vendor_id } = req.body;

    if (!email || !first_name || !last_name || !password || !phone) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          details: "All fields (email, first_name, last_name, password, phone) are required",
        },
      });
    }

    const { user, token } = await customerService.signup({
      email,
      first_name,
      last_name,
      password,
      phone,
      vendor_id,
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Lax for local testing
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(201).json({
      status: 201,
      success: true,
      message: "Resource created successfully",
      data: user,
    });
  } catch (error) {
    if (error.message.includes("already registered")) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "Conflict detected",
        data: null,
        error: { code: "RESOURCE_EXISTS", details: "Email already registered" },
      });
    }
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          details: "Email and password are required",
        },
      });
    }

    const { token } = await customerService.login({ email, password });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Lax for local testing
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: { message: "Login successful" },
    });
  } catch (error) {
    if (error.message.includes("Invalid credentials")) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized access",
        data: null,
        error: { code: "AUTH_ERROR", details: "Invalid email or password" },
      });
    }
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

// Remaining functions unchanged
const logout = async (req, res) => { /* ... */ };
const getCurrentUser = async (req, res) => { /* ... */ };
const getUsers = async (req, res) => { /* ... */ };
const getCustomerDetails = async (req, res) => { /* ... */ };
const customerByVendorId = async (req, res) => { /* ... */ };
const getAllCustomers = async (req, res) => { /* ... */ };
const getCustomerByEmail = async (req, res) => { /* ... */ };
const updateCustomerDetails = async (req, res) => { /* ... */ };
const changeCustomerPassword = async (req, res) => { /* ... */ };
const resetCustomerPassword = async (req, res) => { /* ... */ };

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  getUsers,
  getCustomerDetails,
  customerByVendorId,
  getAllCustomers,
  getCustomerByEmail,
  updateCustomerDetails,
  changeCustomerPassword,
  resetCustomerPassword,
};