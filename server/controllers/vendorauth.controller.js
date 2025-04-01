const vendorAuthService = require("../services/vendorauth.service");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Email and password are required" },
      });
    }

    const { token, vendor } = await vendorAuthService.authenticate(email, password);

    res.cookie("vendor_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    if (vendor) {
      res.setHeader("Set-Cookie", `vendor_id=${vendor.id}; Path=/; HttpOnly; Secure; SameSite=None;`);
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "Login successful",
      data: { vendor, token },
    });
  } catch (error) {
    if (error.message.includes("Invalid email or password")) {
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

exports.sendResetLink = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Email is required" },
      });
    }

    const result = await vendorAuthService.sendResetLink(email);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Password reset link sent to your email",
      data: null,
    });
  } catch (error) {
    if (error.message === "Email not found") {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "Email not found" },
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

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Token and new password are required" },
      });
    }

    const result = await vendorAuthService.resetPasswordWithToken(token, newPassword);
    res.status(200).json({
      status: 200,
      success: true,
      message: result.message,
      data: result.vendor,
    });
  } catch (error) {
    if (error.message === "Email not found") {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "Email not found" },
      });
    }
    if (error.message.includes("Invalid or expired reset token")) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid input",
        data: null,
        error: { code: "INVALID_DATA", details: error.message },
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

exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { old_password, new_password } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Vendor ID is required" },
      });
    }

    if (!old_password || !new_password) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Invalid input",
        data: null,
        error: { code: "INVALID_DATA", details: "Old and new passwords are required" },
      });
    }

    const result = await vendorAuthService.changePassword(id, { old_password, new_password });

    res.status(200).json({
      status: 200,
      success: true,
      message: result.message,
      data: result.vendor,
    });
  } catch (error) {
    if (error.message === "Vendor or Vendor User not found") {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Resource not found",
        data: null,
        error: { code: "NOT_FOUND", details: "Vendor or Vendor User not found" },
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
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal Server Error",
      data: null,
      error: { code: "SERVER_ERROR", details: error.message },
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const token =
      req.cookies.vendor_auth_token ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid request parameters",
        data: null,
        error: { code: "VALIDATION_ERROR", details: "Token is required for logout" },
      });
    }

    await vendorAuthService.logout(token);

    res.clearCookie("vendor_auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "Logout successful",
      data: null,
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

module.exports = {
  login: exports.login,
  sendResetLink: exports.sendResetLink,
  resetPassword: exports.resetPassword,
  changePassword: exports.changePassword,
  logout: exports.logout,
};