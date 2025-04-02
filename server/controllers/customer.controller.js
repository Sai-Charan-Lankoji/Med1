const customerService = require("../services/customer.service");
const FileService = require("../services/file.service");
const multer = require("multer");
const fileService = new FileService();
const upload = multer(); // Use Multer to parse multipart form-data

// Signup function
const signup = async (req, res) => {
  try {
    const { email, first_name, last_name, password, phone, vendor_id } = req.body;

    // Validate required fields
    if (!email || !first_name || !last_name || !password || !phone) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        error: { code: "VALIDATION_ERROR", details: "All fields are required" },
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

    // Set cookie without specifying domain
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
      // domain: removed to default to backend's host (med1-wyou.onrender.com)
    });
    res.status(201).json({
      status: 201,
      success: true,
      message: "Customer signed up successfully",
      data: user,
    });
  } catch (error) {
    if (error.message.includes("already registered")) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "Email already registered",
        error: { code: "RESOURCE_EXISTS", details: error.message },
      });
    }
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

// Login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        error: { code: "VALIDATION_ERROR", details: "Email and password are required" },
      });
    }

    const { token } = await customerService.login({ email, password });

   // Set cookie without specifying domain
   res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
    // domain: removed to default to backend's host (med1-wyou.onrender.com)
  });

  res.set("Access-Control-Allow-Origin", req.headers.origin);
  res.set("Access-Control-Allow-Credentials", "true");

    res.status(200).json({
      status: 200,
      success: true,
      message: "Customer logged in successfully",
      data: { message: "Login successful", token },
    });
  } catch (error) {
    if (error.message.includes("Invalid credentials")) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid email or password",
        error: { code: "AUTH_ERROR", details: error.message },
      });
    }
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

// Logout function (unchanged, but included for completeness)
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
      domain: ".vercel.app", // Clear cookie across subdomains
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "Customer logged out successfully",
      data: { message: "Logout successful" },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "No user ID in token", error: { code: "AUTH_ERROR" } });

    const customer = await customerService.getCustomerDetails(userId);
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found", error: { code: "NOT_FOUND" } });

    res.status(200).json({ success: true, message: "Retrieved Customer Successfully", data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: { code: "SERVER_ERROR", details: error.message } });
  }
};
const getUsers = async (req, res) => {
  try {
    const { page, limit, role } = req.query;
    const customers = await customerService.getUsers(
      parseInt(page) || 1,
      parseInt(limit) || 10,
      role
    );

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
        error: {
          code: "NOT_FOUND",
          details: "No customers found for this vendor ID",
        },
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
        error: {
          code: "NOT_FOUND",
          details: "Customer not found with this email",
        },
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
    const { email, first_name, last_name, phone } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Customer ID is required" },
      });
    }

    if (req.method !== "PUT") {
      return res.status(405).json({
        status: 405,
        success: false,
        message: "Method Not Allowed",
        data: null,
        error: { code: "INVALID_METHOD", details: "Use PUT instead" },
      });
    }

    let profile_photo = null;
    if (req.file) {
      try {
        const fileData = await fileService.saveBase64File(
          req.file.buffer.toString("base64"),
          req
        );
        profile_photo = fileData.url;
      } catch (fileError) {
        return res.status(422).json({
          status: 422,
          success: false,
          message: "Invalid input",
          data: null,
          error: {
            code: "INVALID_DATA",
            details: "Failed to process profile photo",
          },
        });
      }
    }

    const updatedCustomer = await customerService.updateCustomerDetails(id, {
      email,
      first_name,
      last_name,
      phone,
      profile_photo,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Request successful",
      data: updatedCustomer,
    });
  } catch (error) {
    if (error.message === "Customer not found") {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "Customer does not exist" },
      });
    }

    if (error.message.includes("duplicate key")) {
      return res.status(409).json({
        status: 409,
        success: false,
        message: "Conflict detected",
        data: null,
        error: { code: "RESOURCE_EXISTS", details: "Email already in use" },
      });
    }

    console.error("Controller Error:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: "An unexpected error occurred" },
    });
  }
};

const changeCustomerPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { old_password, new_password } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Customer ID is required" },
      });
    }

    if (!old_password || !new_password) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Invalid input",
        data: null,
        error: {
          code: "INVALID_DATA",
          details: "Old and new passwords are required",
        },
      });
    }

    const updatedCustomer = await customerService.changeCustomerPassword(id, {
      old_password,
      new_password,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Password changed successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    if (error.message === "Customer not found") {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "Customer does not exist" },
      });
    }

    if (error.message === "Old password is incorrect") {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized access",
        data: null,
        error: { code: "AUTH_ERROR", details: "Invalid old password" },
      });
    }

    console.error("Controller Error:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: "An unexpected error occurred" },
    });
  }
};

const resetCustomerPassword = async (req, res) => {
  try {
    const { email, origin } = req.body; // Extract origin from request body

    if (!email || !origin) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Email and origin are required" },
      });
    }

    await customerService.resetCustomerPassword(email, origin); // Pass origin to service

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Password reset link sent to your email",
      data: null,
    });
  } catch (error) {
    if (error.message === "Customer not found") {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "Customer does not exist" },
      });
    }

    console.error("Controller Error:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: "An unexpected error occurred" },
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
  changeCustomerPassword,
  resetCustomerPassword,
};
