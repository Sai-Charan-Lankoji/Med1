const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/tokenBlacklist.model");
const { promisify } = require("util");
const jwtVerifyAsync = promisify(jwt.verify);

const authMiddleware = async (req, res, next) => {
  if (req.path === "/api/customer/logout" && req.method === "POST") return next();

  try {
    const token = req.cookies.auth_token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
    if (!token) return res.status(401).json({ success: false, message: "No token provided", error: { code: "NO_TOKEN" } });

    const blacklisted = await TokenBlacklist.findOne({ where: { token } });
    if (blacklisted) return res.status(401).json({ success: false, message: "Token revoked", error: { code: "TOKEN_BLACKLISTED" } });

    const decoded = await jwtVerifyAsync(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    req.user = decoded;
    next();
  } catch (error) {
    const errorDetails = {
      code: error.name === "TokenExpiredError" ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
      details: error.message,
    };
    return res.status(401).json({ success: false, message: "Authentication failed", error: errorDetails });
  }
};

module.exports = authMiddleware;