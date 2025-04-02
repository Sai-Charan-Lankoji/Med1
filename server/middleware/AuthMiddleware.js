const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/tokenBlacklist.model");
const { promisify } = require("util");
const jwtVerifyAsync = promisify(jwt.verify);

const authMiddleware = async (req, res, next) => {
  // Skip token check for logout endpoints
  if (
    (req.path === "/api/customer/logout" && req.method === "POST") ||
    (req.path === "/api/vendor/logout" && req.method === "POST")
  ) {
    return next();
  }

  try {
    const token =
      req.cookies.auth_token ||
      (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        error: { code: "NO_TOKEN", details: "No authentication token provided" },
      });
    }

    const blacklisted = await TokenBlacklist.findOne({ where: { token } });
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        error: { code: "TOKEN_BLACKLISTED", details: "Token has been revoked" },
      });
    }

    const decoded = await jwtVerifyAsync(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    req.user = decoded;
    next();
  } catch (error) {
    let status = 401;
    let errorDetails = { code: "INVALID_TOKEN", details: "Invalid or expired token" };

    if (error.name === "JsonWebTokenError") {
      errorDetails = { code: "TOKEN_MALFORMED", details: "Token is malformed or invalid" };
    } else if (error.name === "TokenExpiredError") {
      errorDetails = { code: "TOKEN_EXPIRED", details: "Token has expired" };
    }

    return res.status(status).json({
      success: false,
      message: "Authentication failed",
      error: errorDetails,
    });
  }
};

module.exports = authMiddleware;