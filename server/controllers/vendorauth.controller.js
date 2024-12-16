const vendorauthService = require("../services/vendorauth.service");
const vendorAuthService = require("../services/vendorauth.service");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate the user
    const { token, vendor } = await vendorAuthService.authenticate(email, password);

    // Set a cookie for the vendor (if applicable)
    if (vendor) {
      res.setHeader(
        "Set-Cookie",
        `vendor_id=${vendor.id}; Path=/; HttpOnly; Secure; SameSite=None;`
      );
    }

    // Respond with the token and user details
    res.status(200).json({ token, vendor });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}
  exports.resetPassword = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      // Call the resetPassword service method
      const result = await vendorAuthService.resetPassword(email, newPassword);
  
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  exports.logout = async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
      if (!token) {
        return res.status(400).json({ error: "Token is required for logout." });
      }
  
      await vendorauthService.logout(token); // Call logout service
      res.status(200).json({ message: "Logout successful." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
