// backend/services/auth.service.js
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');
const TokenBlacklist = require('../models/tokenBlacklist.model');
// const TokenEncryption = require('../utils/encryption');

class AuthService {
  static SALT_ROUNDS = 12;
  static PASSWORD_MIN_LENGTH = 8;

  validateSignupData(data) {
    const { email, password, first_name, last_name } = data;
    if (!email?.trim() || !password || !first_name?.trim() || !last_name?.trim()) {
      throw new Error('All fields are required.');
    }
    if (password.length < AuthService.PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${AuthService.PASSWORD_MIN_LENGTH} characters long.`);
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new Error('Invalid email format.');
    }
  }

  async signup(data) {
    try {
      this.validateSignupData(data);
      const { email, first_name, last_name, password, role } = data;

      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() },
      });
      if (existingUser) {
        throw new Error('Email is already registered.');
      }

      const password_hash = await bcrypt.hash(password, AuthService.SALT_ROUNDS);
      const user = await User.create({
        email: email.toLowerCase(),
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        password_hash,
        role: role || 'user',
      });

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // const encryptedToken = await TokenEncryption.encrypt(token); // Await async encryption
      const { password_hash: _, ...userWithoutPassword } = user.toJSON();
      return { user: userWithoutPassword, token: token };
    } catch (error) {
      throw new Error(`Signup failed: ${error.message}`);
    }
  }

  // backend/services/auth.service.js
async login(data) {
  try {
    const { email, password } = data;
    if (!email?.trim() || !password) {
      throw new Error('Email and password are required.');
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      throw new Error('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // const encryptedToken = await TokenEncryption.encrypt(token);
    return { token: token }; // Only return token
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

  async logout(token) {
    try {
      if (!token?.trim()) {
        throw new Error('Valid token is required for logout.');
      }

      const existingBlacklist = await TokenBlacklist.findOne({ where: { token } });
      if (existingBlacklist) {
        throw new Error('Token is already invalidated.');
      }

      await TokenBlacklist.create({
        token,
        blacklisted_at: new Date(),
      });

      return { message: 'Logged out successfully.' };
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  async getUsers(page = 1, limit = 10, role) {
    try {
      const offset = (page - 1) * limit;
      const query = {
        limit,
        offset,
        attributes: { exclude: ['password_hash'] },
        order: [['created_at', 'DESC']],
      };
      if (role) query.where = { role };

      const { count, rows } = await User.findAndCountAll(query);
      return {
        users: rows,
        total: count,
        page,
        total_pages: Math.ceil(count / limit),
      };
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }
}

module.exports = AuthService;