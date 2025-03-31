// backend/controllers/auth.controller.js
const AuthService = require("../services/auth.service");
const authService = new AuthService();
const User = require("../models/user.model");

const signup = async (req, res) => {
  try {
    const { email, first_name, last_name, password, role } = req.body;
    const { user, token } = await authService.signup({
      email,
      first_name,
      last_name,
      password,
      role,
    });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // True on Render
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token } = await authService.login({ email, password });

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/", // Ensure cookie is available for all paths
    });

    res.set("Access-Control-Allow-Origin", req.headers.origin);
    res.set("Access-Control-Allow-Credentials", "true");

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};


const logout = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    await authService.logout(token);

    res.clearCookie("auth_token");
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User ID not found in token" });
    }

    const user = await User.findByPk(userId, {
      attributes: ["id", "email", "first_name", "last_name", "role"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page, limit, role } = req.query;
    const users = await authService.getUsers(
      parseInt(page) || 1,
      parseInt(limit) || 10,
      role
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getUsers,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
