const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const TokenBlacklist = require('../models/tokenBlacklist.model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require('sequelize');

class AuthService {
  static SALT_ROUNDS = 12;
  static PASSWORD_MIN_LENGTH = 8;

  constructor() {
    const smtpConfig = {
      host: process.env.SMTP_SERVER,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SSL === 'true',
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    // Log SMTP config for debugging
    console.log("Initializing SMTP Transporter with config:", {
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      user: smtpConfig.auth.user,
      pass: smtpConfig.auth.pass ? "[REDACTED]" : undefined,
    });

    // Validate SMTP credentials
    if (!smtpConfig.host || !smtpConfig.port || !smtpConfig.auth.user || !smtpConfig.auth.pass) {
      console.error("SMTP configuration is incomplete. Check environment variables.");
      throw new Error('SMTP configuration is incomplete. Missing required credentials.');
    }

    this.transporter = nodemailer.createTransport(smtpConfig);

    // Verify transporter setup
    this.transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP Transporter verification failed:", error);
      } else {
        console.log("SMTP Transporter is ready to send emails.");
      }
    });
  }

  validateSignupData(data) {
    const { email, password, first_name, last_name } = data;
    if (!email?.trim() || !password || !first_name?.trim() || !last_name?.trim()) {
      throw new Error('All fields are required.');
    }
    if (password.length < this.constructor.PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${this.constructor.PASSWORD_MIN_LENGTH} characters long.`);
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new Error('Invalid email format.');
    }
  }

  async signup(data) {
    this.validateSignupData(data);
    const { email, first_name, last_name, password, role } = data;

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) throw new Error('Email is already registered.');

    const password_hash = await bcrypt.hash(password, this.constructor.SALT_ROUNDS);
    const user = await User.create({
      email: email.toLowerCase(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      password_hash,
      role: role || 'member',
    });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const { password_hash: _, ...userWithoutPassword } = user.toJSON();
    return { user: userWithoutPassword, token };
  }

  async login(data) {
    const { email, password } = data;
    if (!email?.trim() || !password) throw new Error('Email and password are required.');

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new Error('Invalid credentials.');
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    return { token };
  }

  async logout(token) {
    if (!token?.trim()) {
      return { message: "No token to logout." };
    }
  
    const existingBlacklist = await TokenBlacklist.findOne({ where: { token } });
    if (existingBlacklist) {
      return { message: "Token already invalidated." };
    }
  
    await TokenBlacklist.create({ token, blacklisted_at: new Date() });
    return { message: "Logged out successfully." };
  }

  async getUsers(page = 1, limit = 10, role) {
    const offset = (page - 1) * limit;
    const query = {
      limit,
      offset,
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
      paranoid: true,
    };
    if (role) query.where = { role };

    const { count, rows } = await User.findAndCountAll(query);
    return { users: rows, total: count, page, total_pages: Math.ceil(count / limit) };
  }

  async forgotPassword(email) {
    if (!email?.trim()) throw new Error('Email is required.');
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new Error('Invalid email format.');
    }

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) throw new Error('Email not found.');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, this.constructor.SALT_ROUNDS);
    const resetTokenExpires = new Date(Date.now() + 3600000);

    await user.update({
      reset_password_token: resetTokenHash,
      reset_password_expires: resetTokenExpires,
    });

    const resetUrl = `https://med1-4217.vercel.app/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: 'Password Reset Request - Vendor Hub',
      text: `You requested a password reset for Vendor Hub. Click this link to reset your password: ${resetUrl}\n\nIf you didn’t request this, please ignore this email.`,
      html: `<p>You requested a password reset for Vendor Hub. Click <a href="${resetUrl}">here</a> to reset your password.</p><p>If you didn’t request this, please ignore this email.</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Reset email sent successfully to:", email);
    } catch (error) {
      console.error("Failed to send reset email:", error);
      throw new Error('Failed to send reset email. Please try again later.');
    }
  }

  async resetPassword(token, password) {
    if (!token?.trim() || !password) throw new Error('Token and password are required.');
    if (password.length < this.constructor.PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${this.constructor.PASSWORD_MIN_LENGTH} characters long.`);
    }

    const user = await User.findOne({
      where: {
        reset_password_expires: { [Op.gt]: new Date() },
      },
    });

    if (!user || !user.reset_password_token) throw new Error('Invalid or expired reset token.');

    const isTokenValid = await bcrypt.compare(token, user.reset_password_token);
    if (!isTokenValid) throw new Error('Invalid reset token.');

    const password_hash = await bcrypt.hash(password, this.constructor.SALT_ROUNDS);
    await user.update({
      password_hash,
      reset_password_token: null,
      reset_password_expires: null,
    });
  }
}

module.exports = AuthService;