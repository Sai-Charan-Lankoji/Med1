const jwt = require("jsonwebtoken");
const TokenEncryption = require("../utils/encryption");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
    }

    // Extract Encrypted Token from Header
    const encryptedToken = authHeader.replace("Bearer ", "");

    // ✅ Decrypt the token
    const decryptedToken = TokenEncryption.decrypt(encryptedToken);

    // ✅ Verify the original JWT token
    const decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET);

    // ✅ Attach decoded user info to req.user
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
  }
};
