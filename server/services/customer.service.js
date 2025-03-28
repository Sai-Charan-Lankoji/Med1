const Customer = require("../models/customer.model");
const TokenBlacklist = require("../models/tokenBlacklist.model");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const TokenEncryption = require("../utils/encryption");
const nodemailer = require("nodemailer"); // For sending emails
class CustomerService {
  static SALT_ROUNDS = 10; // Match admin's 12 or adjust as needed
  static PASSWORD_MIN_LENGTH = 8;

  validateSignupData(data) {
    const { email, password, first_name, last_name, phone } = data;
    if (
      !email?.trim() ||
      !password ||
      !first_name?.trim() ||
      !last_name?.trim() ||
      !phone
    ) {
      throw new Error(
        "All fields (email, password, first_name, last_name, phone) are required."
      );
    }
    if (password.length < CustomerService.PASSWORD_MIN_LENGTH) {
      throw new Error(
        `Password must be at least ${CustomerService.PASSWORD_MIN_LENGTH} characters long.`
      );
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new Error("Invalid email format.");
    }
  }

  async signup(data) {
    try {
      this.validateSignupData(data);
      const { email, first_name, last_name, password, phone, vendor_id } = data;

      const existingCustomer = await Customer.findOne({ where: { email } });
      if (existingCustomer) {
        throw new Error("Customer with this email already exists.");
      }

      const password_hash = await bcrypt.hash(
        password,
        CustomerService.SALT_ROUNDS
      );
      const customer = await Customer.create({
        email,
        first_name,
        last_name,
        password_hash,
        phone,
        vendor_id,
      });

      const token = generateToken({
        id: customer.id,
        email: customer.email,
        role: "customer", // Explicit role for customer
      });

      const encryptedToken = TokenEncryption.encrypt(token);
      const { password_hash: _, ...customerWithoutPassword } =
        customer.toJSON();
      return { user: customerWithoutPassword, token: encryptedToken };
    } catch (error) {
      throw new Error(`Signup failed: ${error.message}`);
    }
  }

  async login(data) {
    try {
      const { email, password } = data;
      if (!email?.trim() || !password) {
        throw new Error("Email and password are required.");
      }

      const customer = await Customer.findOne({ where: { email } });
      if (!customer) {
        throw new Error("Invalid credentials.");
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        customer.password_hash
      );
      if (!isPasswordValid) {
        throw new Error("Invalid credentials.");
      }

      const token = generateToken({
        id: customer.id,
        email: customer.email,
        role: "customer",
      });

      // const encryptedToken = TokenEncryption.encrypt(token);
      return { token: token };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async logout(token) {
    if (!token) {
      throw new Error("Token is required for logout.");
    }

    try {
      const blacklistedToken = await TokenBlacklist.create({ token });
      return { message: "Logout successful." };
    } catch (error) {
      console.error("Error blacklisting token: ", error);
      throw new Error("Failed to blacklist token.");
    }
  }

  async getUsers(page = 1, limit = 10, role) {
    try {
      const offset = (page - 1) * limit;
      const query = {
        limit,
        offset,
        attributes: { exclude: ["password_hash"] },
        order: [["created_at", "DESC"]],
      };
      if (role) query.where = { role }; // Filter by role if provided

      const { count, rows } = await Customer.findAndCountAll(query);
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

  // Retain unique methods
  async getCustomerDetails(customer_id) {
    if (!customer_id) {
      throw new Error("Customer ID is required.");
    }
    return await Customer.findByPk(customer_id);
  }

  async getCustomerByVendorId(vendor_id) {
    if (!vendor_id) {
      throw new Error("Vendor ID is required.");
    }
    console.log("Querying customers with vendor_id:", vendor_id);
    return await Customer.findAll({ where: { vendor_id } });
  }

  async list() {
    return await Customer.findAll();
  }

  async getCustomerByEmail(email) {
    if (!email) {
      throw new Error("Email is required.");
    }

    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      throw new Error("Customer not found.");
    }

    return customer;
  }

  SALT_ROUNDS = 10;

  validateInput(data) {
    const { email, first_name, last_name, phone } = data;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }

    if (first_name && (first_name.length < 2 || first_name.length > 50)) {
      throw new Error("First name must be 2-50 characters");
    }

    if (last_name && (last_name.length < 2 || last_name.length > 50)) {
      throw new Error("Last name must be 2-50 characters");
    }

    if (phone && !/^\d{10,15}$/.test(phone)) {
      throw new Error("Phone number must be 10-15 digits");
    }
  }

  async updateCustomerDetails(id, updateData) {
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        throw new Error("Customer not found");
      }

      this.validateInput(updateData);

      const updateFields = {};
      if (updateData.email) updateFields.email = updateData.email;
      if (updateData.first_name) updateFields.first_name = updateData.first_name;
      if (updateData.last_name) updateFields.last_name = updateData.last_name;
      if (updateData.phone) updateFields.phone = updateData.phone;
      if (updateData.profile_photo) updateFields.profile_photo = updateData.profile_photo;

      if (Object.keys(updateFields).length === 0) {
        return {
          id: customer.id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          phone: customer.phone,
          profile_photo: customer.profile_photo,
          updated_at: customer.updated_at,
        };
      }

      updateFields.updated_at = new Date();
      await customer.update(updateFields);

      return {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        profile_photo: customer.profile_photo,
        updated_at: customer.updated_at,
      };
    } catch (error) {
      console.error("Service Error updating customer:", error.message);
      throw error;
    }
  }

  async changeCustomerPassword(id, { old_password, new_password }) {
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        throw new Error("Customer not found");
      }

      const isMatch = await bcrypt.compare(old_password, customer.password_hash);
      if (!isMatch) {
        throw new Error("Old password is incorrect");
      }

      const newPasswordHash = await bcrypt.hash(new_password, this.SALT_ROUNDS);
      await customer.update({ password_hash: newPasswordHash, updated_at: new Date() });

      return {
        id: customer.id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        profile_photo: customer.profile_photo,
        updated_at: customer.updated_at,
      };
    } catch (error) {
      console.error("Service Error changing password:", error.message);
      throw error;
    }
  }

  async resetCustomerPassword(email) {
    try {
      const customer = await Customer.findOne({ where: { email } });
      if (!customer) {
        throw new Error("Customer not found");
      }

      // Generate a reset token (simplified for this example)
      const resetToken = Math.random().toString(36).slice(2);
      // In a real app, store the token in the database with an expiration time
      // For this example, we'll just send it in the email

      // Send email with reset link (using nodemailer)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: email,
        subject: "Password Reset Request",
        text: `Click the following link to reset your password: http://localhost:3000/profile?token=${resetToken}`,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Service Error resetting password:", error.message);
      throw error;
    }
  }
}

module.exports = new CustomerService();