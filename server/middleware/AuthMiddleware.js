const jwt = require("jsonwebtoken");
const TokenEncryption = require("../utils/encryption");

const authMiddleware = (req, res, next) => {
  try {
    // Extract Authorization header
    const authHeader = req.header("Authorization");

    // Check if Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Unauthorized access",
        data: null,
        error: {
          code: "AUTH_ERROR",
          details: "No token provided",
        },
      });
    }

    // Extract encrypted token from header
    const encryptedToken = authHeader.replace("Bearer ", "");

    // Decrypt the token
    const decryptedToken = TokenEncryption.decrypt(encryptedToken);

    // Verify the decrypted JWT token
    const decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET);

    // Attach decoded user info to req.user
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error.message);

    let status = 401;
    let errorCode = "AUTH_ERROR";
    let errorDetails = "Invalid token";

    // Handle specific JWT verification errors
    if (error.name === "TokenExpiredError") {
      status = 401;
      errorCode = "TOKEN_EXPIRED";
      errorDetails = "Token has expired";
    } else if (error.name === "JsonWebTokenError") {
      status = 401;
      errorCode = "INVALID_TOKEN";
      errorDetails = "Invalid token format";
    } else if (error.name === "NotBeforeError") {
      status = 401;
      errorCode = "TOKEN_NOT_YET_VALID";
      errorDetails = "Token is not yet valid";
    } else if (error instanceof Error && error.message.includes("decryption")) {
      status = 401;
      errorCode = "DECRYPTION_ERROR";
      errorDetails = "Failed to decrypt token";
    }

    return res.status(status).json({
      status,
      success: false,
      message: "Unauthorized access",
      data: null,
      error: {
        code: errorCode,
        details: errorDetails,
      },
    });
  }
};

module.exports = authMiddleware;