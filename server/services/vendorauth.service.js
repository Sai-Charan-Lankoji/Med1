const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendor.model");
const VendorUser = require("../models/vendoruser.model")
const TokenBlacklist = require("../models/tokenBlacklist.model");
const { generateToken } = require("../utils/jwt");

class VendorAuthService {
  /**
   * Authenticate a vendor or vendor user and return a token if valid.
   */
  async authenticate(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    // Attempt to find a vendor with the given email
    const vendor = await Vendor.findOne({ where: { contact_email: email } });
    if (vendor) {
      const isPasswordValid = await bcrypt.compare(password, vendor.password);
      if (isPasswordValid) {
        const token = generateToken({
          id: vendor.id,
          email: vendor.contact_email,
        });
        return { token, vendor };
      } else {
        throw new Error("Invalid email or password.");
      }
    }

    const vendorUser = await VendorUser.findOne({ where: { email: email } });
    if (vendorUser) {
      const isPasswordValid = await bcrypt.compare(password, vendorUser.password);
      if (isPasswordValid) {
        const token = generateToken({
          id: vendorUser.id,
          email: vendorUser.email,
        });
        return { token, vendorUser };
      }else{
        throw new Error("Invalid Password.");
      }
    } 
  }

  async resetPassword(email, newPassword) {
    if (!email || !newPassword) {
      throw new Error("Email and new password are required.");
    }

    // Check if email belongs to a Vendor
    const vendor = await Vendor.findOne({ where: { contact_email: email } });
    if (vendor) {
      const isPasswordSame = await bcrypt.compare(newPassword, vendor.password);
      if (isPasswordSame) {
        throw new Error("New password must be different from the current password.");
      }

      vendor.password = await bcrypt.hash(newPassword, 10);
      await vendor.save();
      return { message: "Password reset successful for Vendor." };
    }
    const vendorUser = await VendorUser.findOne({ where: { email } });
    if (vendorUser) {
      const isPasswordSame = await bcrypt.compare(newPassword, vendorUser.password);
      if (isPasswordSame) {
        throw new Error("New password must be different from the current password.");
      }

      vendorUser.password = await bcrypt.hash(newPassword, 10);
      await vendorUser.save();
      return { message: "Password reset successful for Vendor User." };
    }

    throw new Error("Email not found.");
  }
  async logout(token) {
    if (!token) {
      throw new Error("Token is required for logout.");
    }

    try {
      const blacklistedToken = await TokenBlacklist.create({ token });
      console.log("Blacklisted Token: ", blacklistedToken);
      return { message: "Logout successful." };
    } catch (error) {
      console.error("Error blacklisting token: ", error);
      throw new Error("Failed to blacklist token.");
    }
  }
}

module.exports = new VendorAuthService();
