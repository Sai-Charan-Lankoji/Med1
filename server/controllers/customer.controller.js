const customerService = require("../services/customer.service");
const FileService = require("../services/file.service");
const multer = require("multer");
const fileService = new FileService();
const upload = multer(); // Use Multer to parse multipart form-data

const signup = async (req, res) => {
  try {
    const { email, first_name, last_name, password, phone, vendor_id } = req.body;

    // Validate required fields
    if (!email || !first_name || !last_name || !password || !phone) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "All fields (email, first_name, last_name, password, phone) are required" },
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

    // Set encrypted token in cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Email and password are required" },
      });
    }

    const { token } = await customerService.login({ email, password });

    // Set encrypted token in cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
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

const logout = async (req, res) => {
  try {
    const token = req.cookies.auth_token || 
                  (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
                    ? req.headers.authorization.split(" ")[1]
                    : null);

    // If token is present, blacklist it
    if (token) {
      await customerService.logout(token);
    }

    // Clear the auth_token cookie
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: { message: "Logout successful" },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized access",
        data: null,
        error: { code: "AUTH_ERROR", details: "User ID not found in token" },
      });
    }

    const customer = await customerService.getCustomerDetails(userId);
    if (!customer) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "Customer not found" },
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page, limit, role } = req.query;
    const customers = await customerService.getUsers(parseInt(page) || 1, parseInt(limit) || 10, role);

    if (!customers || customers.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "No users found" },
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

const getCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Customer ID is required" },
      });
    }

    const customer = await customerService.getCustomerDetails(id);
    if (!customer) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "Customer not found" },
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

const customerByVendorId = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    if (!vendor_id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Vendor ID is required" },
      });
    }

    const customers = await customerService.getCustomerByVendorId(vendor_id);
    if (!customers || customers.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "No customers found for this vendor ID" },
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.list();
    if (!customers || customers.length === 0) {
      return res.status(204).json({
        status: 204,
        success: true,
        message: "No content available",
        data: null,
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

const getCustomerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Email is required" },
      });
    }

    const customer = await customerService.getCustomerByEmail(email);
    if (!customer) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "Customer not found with this email" },
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

const updateCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, phone, old_password, new_password } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Customer ID is required" },
      });
    }

    let profile_photo = null;
    if (req.file) {
      const fileData = await fileService.saveBase64File(req.file.buffer.toString("base64"), req);
      profile_photo = fileData.url;
    }

    const updatedCustomer = await customerService.updateCustomerDetails(id, {
      email,
      first_name,
      last_name,
      phone,
      profile_photo,
      old_password,
      new_password,
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: updatedCustomer,
    });
  } catch (error) {
    if (error.message.includes("Invalid old password")) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized access",
        data: null,
        error: { code: "AUTH_ERROR", details: "Invalid old password" },
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
};