const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/tokenBlacklist.model");

// Utility to promisify jwt.verify for cleaner async/await
const { promisify } = require("util");
const jwtVerifyAsync = promisify(jwt.verify);

// Optional: Add a logging library (e.g., winston) for better logging
const logger = console; // Replace with winston or similar in production

const authMiddleware = async (req, res, next) => {
  // Skip token check for logout endpoint
  if (req.path === "/api/customer/logout" && req.method === "POST") {
    return next();
  }

  try {
    // Extract token from cookies or Authorization header (Bearer)
    const token =
      req.cookies.auth_token ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    console.log("Received cookies:", req.cookies); // Debug log
    console.log("Received token:", token); // Debug log

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        error: {
          code: "NO_TOKEN",
          details: "No authentication token provided",
        },
      });
    }

    // Check if token is blacklisted
    const blacklisted = await TokenBlacklist.findOne({ where: { token } });
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        error: { code: "TOKEN_BLACKLISTED", details: "Token has been revoked" },
      });
    }

    // Verify token
    const decoded = await jwtVerifyAsync(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"], // Enforce specific algorithm to prevent alg switching
    });

    // Optional: Add additional checks (e.g., issuer, audience)
    if (process.env.JWT_ISSUER && decoded.iss !== process.env.JWT_ISSUER) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        error: { code: "INVALID_ISSUER", details: "Token issuer is invalid" },
      });
    }

    // Attach decoded user data to request
    req.user = decoded;
    next();
  } catch (error) {
    // Enhanced error handling
    let status = 401;
    let errorDetails = {
      code: "INVALID_TOKEN",
      details: "Invalid or expired token",
    };

    if (error.name === "JsonWebTokenError") {
      errorDetails = {
        code: "TOKEN_MALFORMED",
        details: "Token is malformed or invalid",
      };
    } else if (error.name === "TokenExpiredError") {
      errorDetails = { code: "TOKEN_EXPIRED", details: "Token has expired" };
    }

    logger.error("Authentication error:", {
      error: error.message,
      path: req.path,
    });

    return res.status(status).json({
      success: false,
      message: "Authentication failed",
      error: errorDetails,
    });
  }
};

module.exports = authMiddleware;
