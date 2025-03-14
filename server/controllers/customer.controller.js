const customerService = require("../services/customer.service");
const FileService = require("../services/file.service");
const multer = require("multer");
const fileService = new FileService();
const upload = multer(); // Use Multer to parse multipart form-data

const signup = async (req, res) => {
  try {
    const { email, first_name, last_name, password, phone, vendor_id } = req.body;
    const { user, token } = await customerService.signup({
      email,
      first_name,
      last_name,
      password,
      phone,
      vendor_id,
    });

    // Set encrypted token in cookie (matching admin)
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(201).json(user); // Return user only, no token
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token } = await customerService.login({ email, password }); // Only need token

    // Set encrypted token in cookie (matching admin)
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({ message: "Login successful" }); // Minimal response
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
    if (!token) {
      return res.status(400).json({ error: "Token is required for logout." });
    }

    await customerService.logout(token);
    res.clearCookie("auth_token");
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id; // Safely access req.user.id
    if (!userId) {
      return res.status(401).json({ error: "User ID not found in token" });
    }

    const customer = await customerService.getCustomerDetails(userId); // Reuse getCustomerDetails
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page, limit, role } = req.query; // Optional query params
    const customers = await customerService.getUsers(parseInt(page) || 1, parseInt(limit) || 10, role);
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Retain unique customer endpoints
const getCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerDetails(id);
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const customerByVendorId = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    console.log("Vendor ID received:", vendor_id);
    const customers = await customerService.getCustomerByVendorId(vendor_id);
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers by vendor ID:", error.message);
    res.status(404).json({ error: error.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.list();
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCustomerByEmail = async (req, res) => {
  try {
    const { email } = req.params; // Extract email from path parameters
    if (!email) {
      throw new Error("Email query parameter is required.");
    }

    const customer = await customerService.getCustomerByEmail(email);
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, phone, old_password, new_password } = req.body;
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

    res.status(200).json({ message: "Profile updated successfully", data: updatedCustomer });
  } catch (error) {
    console.error("❌ Controller Error updating customer:", error);
    res.status(400).json({ error: error.message });
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