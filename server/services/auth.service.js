// backend/services/auth.service.js
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt'); // Assuming you have a JWT utility
const TokenBlacklist = require('../models/tokenBlacklist.model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require('sequelize');

class AuthService {
  static SALT_ROUNDS = 12;
  static PASSWORD_MIN_LENGTH = 8;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SSL === 'true',
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
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
      role: role || 'member', // Default to 'member' as per model
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
    if (!token?.trim()) throw new Error('Valid token is required for logout.');

    const existingBlacklist = await TokenBlacklist.findOne({ where: { token } });
    if (existingBlacklist) throw new Error('Token is already invalidated.');

    await TokenBlacklist.create({ token, blacklisted_at: new Date() });
    return { message: 'Logged out successfully.' };
  }

  async getUsers(page = 1, limit = 10, role) {
    const offset = (page - 1) * limit;
    const query = {
      limit,
      offset,
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
      paranoid: true, // Respect soft deletes
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
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour expiry

    await user.update({
      reset_password_token: resetTokenHash,
      reset_password_expires: resetTokenExpires,
    });

    const resetUrl = `http://localhost:8000/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: 'Password Reset Request - VendorSync',
      text: `You requested a password reset for VendorSync. Click this link to reset your password: ${resetUrl}\n\nIf you didn’t request this, please ignore this email.`,
      html: `<p>You requested a password reset for VendorSync. Click <a href="${resetUrl}">here</a> to reset your password.</p><p>If you didn’t request this, please ignore this email.</p>`,
    };

    await this.transporter.sendMail(mailOptions);
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