const tokenBlacklistService = require("../services/tokeBlacklist.service");

// Add a token to the blacklist
const create = async (req, res) => {
  try {
    const { token } = req.body;
    const blacklistedToken = await tokenBlacklistService.addToken(token);
    res.status(201).json({ success: true, message: "Token blacklisted successfully", token: blacklistedToken });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Check if a token is blacklisted
const checkTokenBlacklist = async (req, res) => {
  try {
    const { token } = req.query;
    const isBlacklisted = await tokenBlacklistService.isTokenBlacklisted(token);
    res.status(200).json({ success: true, blacklisted: isBlacklisted });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Remove a token from the blacklist (optional)
const removeTokenFromBlacklist = async (req, res) => {
  try {
    const { token } = req.body;
    const removed = await tokenBlacklistService.removeToken(token);
    if (removed) {
      res.status(200).json({ success: true, message: "Token removed from blacklist" });
    } else {
      res.status(404).json({ success: false, message: "Token not found in blacklist" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all blacklisted tokens (optional)
const getAllBlacklistedTokens = async (req, res) => {
  try {
    const tokens = await tokenBlacklistService.getAllBlacklistedTokens();
    res.status(200).json({ success: true, tokens });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    create,
  checkTokenBlacklist,
  removeTokenFromBlacklist,
  getAllBlacklistedTokens,
};
