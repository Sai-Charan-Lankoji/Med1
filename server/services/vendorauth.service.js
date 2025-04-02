const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Vendor = require("../models/vendor.model");
const VendorUser = require("../models/vendoruser.model");
const TokenBlacklist = require("../models/tokenBlacklist.model");
const { generateToken } = require("../utils/jwt");
const nodemailer = require("nodemailer");

class VendorAuthService {
  static SALT_ROUNDS = 10;
  static PASSWORD_MIN_LENGTH = 8;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async authenticate(email, password) {
    if (!email?.trim() || !password) throw new Error("Email and password are required");

    const vendor = await Vendor.findOne({ where: { contact_email: email } });
    if (vendor) {
      const isPasswordValid = await bcrypt.compare(password, vendor.password);
      if (isPasswordValid) {
        const token = generateToken({
          id: vendor.id,
          email: vendor.contact_email,
          role: "vendor",
        });
        const { password: _, ...vendorWithoutPassword } = vendor.toJSON();
        return { vendor: vendorWithoutPassword, token };
      } else {
        throw new Error("Invalid email or password");
      }
    }

    const vendorUser = await VendorUser.findOne({ where: { email } });
    if (vendorUser) {
      const isPasswordValid = await bcrypt.compare(password, vendorUser.password);
      if (isPasswordValid) {
        const token = generateToken({
          id: vendorUser.id,
          email: vendorUser.email,
          role: "vendor_user",
        });
        const { password: _, ...vendorUserWithoutPassword } = vendorUser.toJSON();
        return { vendor: vendorUserWithoutPassword, token };
      } else {
        throw new Error("Invalid email or password");
      }
    }

    throw new Error("Invalid email or password");
  }

  async getVendorDetails(id) {
    const vendor = await Vendor.findByPk(id, { attributes: { exclude: ["password"] } });
    if (vendor) {
      return { vendor };
    }

    const vendorUser = await VendorUser.findByPk(id, { attributes: { exclude: ["password"] } });
    if (vendorUser) {
      return { vendorUser };
    }

    return null;
  }

  async sendResetLink(email) {
    if (!email?.trim()) throw new Error("Email is required");
    try {
      const vendor = await Vendor.findOne({ where: { contact_email: email } });
      const user = vendor || (await VendorUser.findOne({ where: { email } }));
      if (!user) throw new Error("Email not found");

      const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      const resetLink = `https://med1-five.vercel.app/forgot-password?token=${resetToken}`;

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Password Reset Request",
        text: `Click this link to reset your password: ${resetLink}\nThis link expires in 1 hour.`,
      };

      await this.transporter.sendMail(mailOptions);
      return { message: "Reset link sent successfully" };
    } catch (error) {
      console.error("Failed to send reset email:", error);
      throw new Error("Failed to send reset email");
    }
  }

  async resetPasswordWithToken(token, newPassword) {
    if (!token || !newPassword) throw new Error("Token and new password are required");
    if (newPassword.length < VendorAuthService.PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${VendorAuthService.PASSWORD_MIN_LENGTH} characters long`);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired reset token");
    }

    const { email } = decoded;
    const vendor = await Vendor.findOne({ where: { contact_email: email } });
    if (vendor) {
      const isPasswordSame = await bcrypt.compare(newPassword, vendor.password);
      if (isPasswordSame) throw new Error("New password must be different from the current password");

      vendor.password = await bcrypt.hash(newPassword, VendorAuthService.SALT_ROUNDS);
      vendor.updated_at = new Date();
      await vendor.save();
      const { password: _, ...vendorWithoutPassword } = vendor.toJSON();
      return { message: "Password reset successful for Vendor", vendor: vendorWithoutPassword };
    }

    const vendorUser = await VendorUser.findOne({ where: { email } });
    if (vendorUser) {
      const isPasswordSame = await bcrypt.compare(newPassword, vendorUser.password);
      if (isPasswordSame) throw new Error("New password must be different from the current password");

      vendorUser.password = await bcrypt.hash(newPassword, VendorAuthService.SALT_ROUNDS);
      vendorUser.updated_at = new Date();
      await vendorUser.save();
      const { password: _, ...vendorUserWithoutPassword } = vendorUser.toJSON();
      return { message: "Password reset successful for Vendor User", vendor: vendorUserWithoutPassword };
    }

    throw new Error("Email not found");
  }

  async changePassword(id, { old_password, new_password }) {
    if (!id) throw new Error("Vendor ID is required");
    if (!old_password || !new_password) throw new Error("Old and new passwords are required");
    if (new_password.length < VendorAuthService.PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${VendorAuthService.PASSWORD_MIN_LENGTH} characters long`);
    }

    const vendor = await Vendor.findByPk(id);
    if (vendor) {
      const isMatch = await bcrypt.compare(old_password, vendor.password);
      if (!isMatch) throw new Error("Old password is incorrect");

      const isPasswordSame = await bcrypt.compare(new_password, vendor.password);
      if (isPasswordSame) throw new Error("New password must be different from the current password");

      vendor.password = await bcrypt.hash(new_password, VendorAuthService.SALT_ROUNDS);
      vendor.updated_at = new Date();
      await vendor.save();
      const { password: _, ...vendorWithoutPassword } = vendor.toJSON();
      return { message: "Password changed successfully", vendor: vendorWithoutPassword };
    }

    const vendorUser = await VendorUser.findByPk(id);
    if (vendorUser) {
      const isMatch = await bcrypt.compare(old_password, vendorUser.password);
      if (!isMatch) throw new Error("Old password is incorrect");

      const isPasswordSame = await bcrypt.compare(new_password, vendorUser.password);
      if (isPasswordSame) throw new Error("New password must be different from the current password");

      vendorUser.password = await bcrypt.hash(new_password, VendorAuthService.SALT_ROUNDS);
      vendorUser.updated_at = new Date();
      await vendorUser.save();
      const { password: _, ...vendorUserWithoutPassword } = vendorUser.toJSON();
      return { message: "Password changed successfully", vendor: vendorUserWithoutPassword };
    }

    throw new Error("Vendor or Vendor User not found");
  }

  async logout(token) {
    if (!token) throw new Error("Token is required for logout");

    try {
      await TokenBlacklist.create({ token });
      return { message: "Logout successful" };
    } catch (error) {
      console.error("Error blacklisting token: ", error);
      throw new Error("Failed to blacklist token");
    }
  }
}

module.exports = new VendorAuthService();