const Customer = require("../models/customer.model");
const TokenBlacklist = require("../models/tokenBlacklist.model");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const TokenEncryption = require("../utils/encryption");
const nodemailer = require("nodemailer");

class CustomerService {
  static SALT_ROUNDS = 10;
  static PASSWORD_MIN_LENGTH = 8;

  addProfilePhotoUrl(customer, req) {
    if (!customer) return customer;

    const baseUrl = process.env.NODE_ENV === "production"
      ? process.env.PRODUCTION_URL
      : `${req.protocol}://${req.get("host")}`;

    const processCustomer = (item) => {
      const result = item.toJSON ? item.toJSON() : { ...item };
      if (result.profile_photo && result.profile_photo.startsWith("/uploads/")) {
        result.profile_photo = `${baseUrl}${result.profile_photo}`;
      }
      return result;
    };

    return Array.isArray(customer) ? customer.map(processCustomer) : processCustomer(customer);
  }

  validateSignupData(data) {
    const { email, password, first_name, last_name, phone } = data;
    if (!email?.trim() || !password || !first_name?.trim() || !last_name?.trim() || !phone) {
      throw new Error("All fields are required.");
    }
    if (password.length < CustomerService.PASSWORD_MIN_LENGTH) {
      throw new Error(`Password must be at least ${CustomerService.PASSWORD_MIN_LENGTH} characters long.`);
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      throw new Error("Invalid email format.");
    }
    if (!/^\+?\d{10,15}$/.test(phone)) {
      throw new Error("Phone number must be 10-15 digits, optionally starting with +.");
    }
  }

  async signup(data, req) {
    this.validateSignupData(data);
    const { email, first_name, last_name, password, phone, vendor_id } = data;

    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      throw new Error("Customer with this email already exists.");
    }

    const password_hash = await bcrypt.hash(password, CustomerService.SALT_ROUNDS);
    const customer = await Customer.create({
      email,
      first_name,
      last_name,
      password_hash,
      phone,
      vendor_id,
    });

    const { password_hash: _, ...customerWithoutPassword } = customer.toJSON();
    return this.addProfilePhotoUrl(customerWithoutPassword, req);
  }

  async login(data, req) {
    const { email, password } = data;
    if (!email?.trim() || !password) {
      throw new Error("Email and password are required.");
    }

    const customer = await Customer.findOne({ where: { email } });
    if (!customer || !(await bcrypt.compare(password, customer.password_hash))) {
      throw new Error("Invalid credentials.");
    }

    const token = generateToken({ id: customer.id, email: customer.email, role: "customer" });
    const { password_hash: _, ...customerData } = customer.toJSON();
    return { token, user: this.addProfilePhotoUrl(customerData, req) };
  }

  async logout(token) {
    if (!token) throw new Error("Token is required for logout.");
    await TokenBlacklist.create({ token });
    return { message: "Logout successful." };
  }

  async getUsers(page = 1, limit = 10, role, req) {
    const offset = (page - 1) * limit;
    const query = {
      limit,
      offset,
      attributes: { exclude: ["password_hash"] },
      order: [["created_at", "DESC"]],
    };
    if (role) query.where = { role };

    const { count, rows } = await Customer.findAndCountAll(query);
    return {
      users: this.addProfilePhotoUrl(rows, req),
      total: count,
      page,
      total_pages: Math.ceil(count / limit),
    };
  }

  async getCustomerDetails(customer_id, req) {
    const customer = await Customer.findByPk(customer_id, {
      attributes: { exclude: ["password_hash"] },
    });
    if (!customer) throw new Error("Customer not found.");
    return this.addProfilePhotoUrl(customer, req);
  }

  async getCustomerByVendorId(vendor_id, req) {
    const customers = await Customer.findAll({
      where: { vendor_id },
      attributes: { exclude: ["password_hash"] },
    });
    return this.addProfilePhotoUrl(customers, req);
  }

  async list(req) {
    const customers = await Customer.findAll({ attributes: { exclude: ["password_hash"] } });
    return this.addProfilePhotoUrl(customers, req);
  }

  async getCustomerByEmail(email, req) {
    const customer = await Customer.findOne({
      where: { email },
      attributes: { exclude: ["password_hash"] },
    });
    if (!customer) throw new Error("Customer not found.");
    return this.addProfilePhotoUrl(customer, req);
  }

  validateInput(data) {
    const { email, first_name, last_name, phone } = data;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid email format");
    if (first_name && (first_name.length < 2 || first_name.length > 50)) throw new Error("First name must be 2-50 characters");
    if (last_name && (last_name.length < 2 || last_name.length > 50)) throw new Error("Last name must be 2-50 characters");
    if (phone && !/^\+?\d{10,15}$/.test(phone)) throw new Error("Phone number must be 10-15 digits, optionally starting with +");
  }

  async updateCustomerDetails(id, updateData, req) {
    const customer = await Customer.findByPk(id);
    if (!customer) throw new Error("Customer not found");

    this.validateInput(updateData);

    const updateFields = {};
    if (updateData.email) updateFields.email = updateData.email;
    if (updateData.first_name) updateFields.first_name = updateData.first_name;
    if (updateData.last_name) updateFields.last_name = updateData.last_name;
    if (updateData.phone) updateFields.phone = updateData.phone;
    if (updateData.profile_photo) updateFields.profile_photo = updateData.profile_photo;

    if (Object.keys(updateFields).length > 0) {
      updateFields.updated_at = new Date();
      await customer.update(updateFields);
    }

    const updatedCustomer = await Customer.findByPk(id, { attributes: { exclude: ["password_hash"] } });
    return this.addProfilePhotoUrl(updatedCustomer, req);
  }

  async changeCustomerPassword(id, { old_password, new_password }, req) {
    const customer = await Customer.findByPk(id);
    if (!customer) throw new Error("Customer not found");

    if (!(await bcrypt.compare(old_password, customer.password_hash))) {
      throw new Error("Old password is incorrect");
    }

    const newPasswordHash = await bcrypt.hash(new_password, this.SALT_ROUNDS);
    await customer.update({ password_hash: newPasswordHash, updated_at: new Date() });

    const updatedCustomer = await Customer.findByPk(id, { attributes: { exclude: ["password_hash"] } });
    return this.addProfilePhotoUrl(updatedCustomer, req);
  }

  async resetCustomerPassword(email, origin) {
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) throw new Error("Customer not found");

    const resetToken = Math.random().toString(36).slice(2);
    const resetLink = `${origin}/profile?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USERNAME,
      to: email,
      subject: "Password Reset Request",
      text: `Click the following link to reset your password: ${resetLink}`,
    });
  }
}

module.exports = new CustomerService();