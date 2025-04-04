const customerService = require("../services/customer.service");
const FileService = require("../services/file.service");
const multer = require("multer");
const fileService = new FileService();
const upload = multer();

// Standardized response helper
const sendResponse = (res, status, success, message, data = null, error = null) => {
  res.status(status).json({ status, success, message, data, error });
};

const signup = async (req, res) => {
  try {
    const { email, first_name, last_name, password, phone, vendor_id } = req.body;

    // Comprehensive input validation
    if (!email || !first_name || !last_name || !password || !phone) {
      return sendResponse(res, 400, false, "All fields are required", null, {
        code: "VALIDATION_ERROR",
        details: "Email, first_name, last_name, password, and phone are required",
      });
    }

    const user = await customerService.signup({ email, first_name, last_name, password, phone, vendor_id }, req);

    // No token or cookie set here; user must log in separately
    sendResponse(res, 201, true, "Customer signed up successfully. Please log in.", user);
  } catch (error) {
    if (error.message.includes("already exists")) {
      return sendResponse(res, 409, false, "Email already registered", null, {
        code: "RESOURCE_EXISTS",
        details: error.message,
      });
    }
    sendResponse(res, 500, false, "Internal Server Error", null, {
      code: "SERVER_ERROR",
      details: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, "Email and password are required", null, {
        code: "VALIDATION_ERROR",
        details: "Email and password are required",
      });
    }

    const { token, user } = await customerService.login({ email, password }, req);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
    });

    sendResponse(res, 200, true, "Customer logged in successfully", { user });
  } catch (error) {
    if (error.message.includes("Invalid credentials")) {
      return sendResponse(res, 401, false, "Invalid email or password", null, {
        code: "AUTH_ERROR",
        details: error.message,
      });
    }
    sendResponse(res, 500, false, "Internal Server Error", null, {
      code: "SERVER_ERROR",
      details: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.auth_token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

    if (token) {
      await customerService.logout(token);
    }

    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    sendResponse(res, 200, true, "Customer logged out successfully", null);
  } catch (error) {
    sendResponse(res, 500, false, "Internal Server Error", null, {
      code: "SERVER_ERROR",
      details: error.message,
    });
  }
};

// Other methods remain largely unchanged but use consistent error handling
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendResponse(res, 401, false, "No user ID in token", null, { code: "AUTH_ERROR" });

    const customer = await customerService.getCustomerDetails(userId, req);
    if (!customer) return sendResponse(res, 404, false, "Customer not found", null, { code: "NOT_FOUND" });

    sendResponse(res, 200, true, "Retrieved Customer Successfully", customer);
  } catch (error) {
    sendResponse(res, 500, false, "Server error", null, { code: "SERVER_ERROR", details: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page, limit, role } = req.query;
    const customers = await customerService.getUsers(parseInt(page) || 1, parseInt(limit) || 10, role, req);

    if (!customers || customers.users.length === 0) {
      return sendResponse(res, 404, false, "No users found", null, { code: "NOT_FOUND" });
    }

    sendResponse(res, 200, true, "Request successful", customers);
  } catch (error) {
    sendResponse(res, 500, false, "Internal Server Error", null, { code: "SERVER_ERROR", details: error.message });
  }
};

const getCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return sendResponse(res, 400, false, "Customer ID is required", null, { code: "VALIDATION_ERROR" });

    const customer = await customerService.getCustomerDetails(id, req);
    if (!customer) return sendResponse(res, 404, false, "Customer not found", null, { code: "NOT_FOUND" });

    sendResponse(res, 200, true, "Request successful", customer);
  } catch (error) {
    sendResponse(res, 500, false, "Internal Server Error", null, { code: "SERVER_ERROR", details: error.message });
  }
};

const customerByVendorId = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    if (!vendor_id) return sendResponse(res, 400, false, "Vendor ID is required", null, { code: "VALIDATION_ERROR" });

    const customers = await customerService.getCustomerByVendorId(vendor_id, req);
    if (!customers || customers.length === 0) {
      return sendResponse(res, 404, false, "No customers found for this vendor ID", null, { code: "NOT_FOUND" });
    }

    sendResponse(res, 200, true, "Request successful", customers);
  } catch (error) {
    sendResponse(res, 500, false, "Internal Server Error", null, { code: "SERVER_ERROR", details: error.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.list(req);
    if (!customers || customers.length === 0) {
      return sendResponse(res, 204, true, "No content available", null);
    }

    sendResponse(res, 200, true, "Request successful", customers);
  } catch (error) {
    sendResponse(res, 500, false, "Internal Server Error", null, { code: "SERVER_ERROR", details: error.message });
  }
};

const getCustomerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return sendResponse(res, 400, false, "Email is required", null, { code: "VALIDATION_ERROR" });

    const customer = await customerService.getCustomerByEmail(email, req);
    if (!customer) return sendResponse(res, 404, false, "Customer not found with this email", null, { code: "NOT_FOUND" });

    sendResponse(res, 200, true, "Request successful", customer);
  } catch (error) {
    sendResponse(res, 500, false, "Internal Server Error", null, { code: "SERVER_ERROR", details: error.message });
  }
};

const updateCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, phone } = req.body;

    if (!id) return sendResponse(res, 400, false, "Customer ID is required", null, { code: "VALIDATION_ERROR" });

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
    }, req);

    sendResponse(res, 200, true, "Request successful", updatedCustomer);
  } catch (error) {
    if (error.message === "Customer not found") {
      return sendResponse(res, 404, false, "Customer does not exist", null, { code: "NOT_FOUND" });
    }
    if (error.message.includes("duplicate key")) {
      return sendResponse(res, 409, false, "Email already in use", null, { code: "RESOURCE_EXISTS" });
    }
    sendResponse(res, 500, false, "Internal Server Error", null, { code: "SERVER_ERROR", details: error.message });
  }
};

const changeCustomerPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { old_password, new_password } = req.body;

    if (!id || !old_password || !new_password) {
      return sendResponse(res, 400, false, "Customer ID, old and new passwords are required", null, { code: "VALIDATION_ERROR" });
    }

    const updatedCustomer = await customerService.changeCustomerPassword(id, { old_password, new_password }, req);

    sendResponse(res, 200, true, "Password changed successfully", updatedCustomer);
  } catch (error) {
    if (error.message === "Customer not found") {
      return sendResponse(res, 404, false, "Customer does not exist", null, { code: "NOT_FOUND" });
    }
    if (error.message === "Old password is incorrect") {
      return sendResponse(res, 401, false, "Invalid old password", null, { code: "AUTH_ERROR" });
    }
    sendResponse(res, 500, false, "Internal Server Error", null, { code: "SERVER_ERROR", details: error.message });
  }
};

const resetCustomerPassword = async (req, res) => {
  try {
    const { email, origin } = req.body;

    if (!email || !origin) {
      return sendResponse(res, 400, false, "Email and origin are required", null, { code: "VALIDATION_ERROR" });
    }

    await customerService.resetCustomerPassword(email, origin);

    sendResponse(res, 200, true, "Password reset link sent to your email", null);
  } catch (error) {
    if (error.message === "Customer not found") {
      return sendResponse(res, 404, false, "Customer does not exist", null, { code: "NOT_FOUND" });
    }
    sendResponse(res, 500, false, "Internal Server Error", null, { code: "SERVER_ERROR", details: error.message });
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
  changeCustomerPassword,
  resetCustomerPassword,
};