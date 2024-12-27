const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt");
const TokenBlacklist = require("../models/tokenBlacklist.model"); 
const TokenEncryption = require("../utils/encryption");

class AuthService {
  // Constants
  static SALT_ROUNDS = 12; // Increased from 10 for better security
  static PASSWORD_MIN_LENGTH = 8;
  
  // Input validation
  validateSignupData(data) {
    const { email, password, first_name, last_name } = data;
    
    if (!email?.trim() || !password || !first_name?.trim() || !last_name?.trim()) {
      throw new Error("All fields are required.");
    }
    
    if (password.length < AuthService.PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${AuthService.PASSWORD_MIN_LENGTH} characters long.`);
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format.");
    }
  }

  // Signup logic with improved validation and error handling
  async signup(data) {
    try {
      // Validate input
      this.validateSignupData(data);
      
      const { email, first_name, last_name, password, role } = data;

      // Check existing user with case-insensitive email search
      const existingUser = await User.findOne({
        where: {
          email: email.toLowerCase()
        }
      });
      
      if (existingUser) {
        throw new Error("Email is already registered.");
      }

      // Hash password with increased security
      const password_hash = await bcrypt.hash(password, AuthService.SALT_ROUNDS);

      // Create user with normalized data
      const user = await User.create({
        email: email.toLowerCase(),
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        password_hash,
        role: role || 'user' // Default role
      });

      // Generate token with essential claims only
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      }); 

      const encryptedToken = TokenEncryption.encrypt(token); 


      // Return sanitized user object
      const { password_hash: _, ...userWithoutPassword } = user.toJSON();
      return { user: userWithoutPassword, token : encryptedToken };
      
    } catch (error) {
      throw new Error(`Signup failed: ${error.message}`);
    }
  }

  // Login logic with rate limiting preparation
  async login(data) {
    try {
      const { email, password } = data;
  
      if (!email?.trim() || !password) {
        throw new Error("Email and password are required.");
      }
  
      const user = await User.findOne({
        where: {
          email: email.toLowerCase()
        }
      });
  
      if (!user) {
        throw new Error("Invalid credentials.");
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials.");
      }
  
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
      });
  
      // Encrypt the token before sending
      const encryptedToken = TokenEncryption.encrypt(token); 
  
      const { password_hash: _, ...userWithoutPassword } = user.toJSON();
      return { user: userWithoutPassword, token: encryptedToken };
  
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
  // Improved logout with token validation
  async logout(token) {
    try {
      if (!token?.trim()) {
        throw new Error("Valid token is required for logout.");
      }

      // Check if token is already blacklisted
      const existingBlacklist = await TokenBlacklist.findOne({
        where: { token }
      });

      if (existingBlacklist) {
        throw new Error("Token is already invalidated.");
      }

      await TokenBlacklist.create({
        token,
        blacklisted_at: new Date()
      });

      return { message: "Logged out successfully." };

    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  // Get users with pagination and role-based access
  async getUsers(page = 1, limit = 10, role) {
    try {
      const offset = (page - 1) * limit;
      const query = {
        limit,
        offset,
        attributes: { exclude: ['password_hash'] }, // Never send passwords
        order: [['created_at', 'DESC']]
      };

      if (role) {
        query.where = { role };
      }

      const { count, rows } = await User.findAndCountAll(query);

      return {
        users: rows,
        total: count,
        page,
        total_pages: Math.ceil(count / limit)
      };

    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }
}

module.exports = AuthService;