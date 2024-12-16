const TokenBlacklist = require("../models/tokenBlacklist.model");

class TokenBlacklistService {
  // Add a token to the blacklist
  async addToken(token) {
    if (!token) {
      throw new Error("Token is required.");
    }
    const blacklistedToken = await TokenBlacklist.create({ token });
    return blacklistedToken;
  }

  // Check if a token is blacklisted
  async isTokenBlacklisted(token) {
    if (!token) {
      throw new Error("Token is required.");
    }
    const foundToken = await TokenBlacklist.findOne({ where: { token } });
    return !!foundToken; // Returns true if the token exists, false otherwise
  }

  // Remove a token from the blacklist (optional)
  async removeToken(token) {
    if (!token) {
      throw new Error("Token is required.");
    }
    const deletedCount = await TokenBlacklist.destroy({ where: { token } });
    return deletedCount > 0; // Returns true if a token was removed, false otherwise
  }

  // Get all blacklisted tokens (optional)
  async getAllBlacklistedTokens() {
    const tokens = await TokenBlacklist.findAll();
    return tokens;
  }
}

module.exports = new TokenBlacklistService();
