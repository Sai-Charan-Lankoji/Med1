const Customer = require("../models/customer.model");
const TokenBlacklist = require("../models/tokenBlacklist.model"); // Example blacklist model
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const TokenEncryption = require("../utils/encryption");

class CustomerService {
  // Create a new customer in the database.
  async createCustomer(data) {
    const { email, first_name, last_name, password, phone, vendor_id } = data;
    // Check if the customer already exists
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      throw new Error("Customer with this email already exists.");
    }
    const password_hash = await bcrypt.hash(password, 10);
    const customer = await Customer.create({
      email,
      first_name,
      last_name,
      password_hash,
      phone,
      vendor_id,
    });

    // Generate a JWT token
    const token = generateToken({
      id: customer.id,
      email: customer.email,
    });

    const encryptedToken = TokenEncryption.encrypt(token);

    return { token: encryptedToken, customer };
  }

  // login Customer
  async loginCustomer(data) {
    const { email, password } = data;
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      throw new Error("Invalid email or password.");
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      customer.password_hash
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }
    const token = generateToken({
      id: customer.id,
      email: customer.email,
    });
    const encryptedToken = TokenEncryption.encrypt(token);
    return { token: encryptedToken, customer };
  }

  // get customer by email
  async getCustomerByEmail(email) {
    if (!email) {
      throw new Error("Email is required.");
    }

    const customer = await Customer.findOne({
      where: { email: email }, // Explicitly query by email
    });

    if (!customer) {
      throw new Error("Customer not found.");
    }

    return customer;
  }

  //customer.Details
  async getCustomerDetails(customer_id) {
    if (!customer_id) {
      throw new Error("Customer ID is required.");
    }
    return await Customer.findByPk(customer_id);
  }

  // get customer by vendor_id
  async getCustomerByVendorId(vendor_id) {
    if (!vendor_id) {
      throw new Error("Vendor ID is required.");
    }
    console.log("Querying customers with vendor_id:", vendor_id); // Debugging
    return await Customer.findAll({ where: { vendor_id } });
  }

  // Fetch all customers from the database.
  async list() {
    return await Customer.findAll();
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
 
  async updateCustomerDetails(id, updateData) {
    try {
        // Fetch the existing customer
        const customer = await Customer.findByPk(id);
        if (!customer) {
            throw new Error("Customer not found");
        }

        // Prepare update fields (preserve existing values if not provided)
        const updateFields = {
            email: updateData.email || customer.email,
            first_name: updateData.first_name || customer.first_name,
            last_name: updateData.last_name || customer.last_name,
            phone: updateData.phone || customer.phone,
            profile_photo: updateData.profile_photo || customer.profile_photo,
        };

        // Handle password update (if requested)
        if (updateData.old_password && updateData.new_password) {
            const isMatch = await bcrypt.compare(updateData.old_password, customer.password_hash);
            if (!isMatch) {
                throw new Error("Old password is incorrect");
            }

            updateFields.password_hash = await bcrypt.hash(updateData.new_password, 10);
        }
        
        await customer.update(updateFields);

        return customer;
    } catch (error) {
        console.error("❌Service Error updating customer:", error.message);
        throw new Error(`Error updating customer: ${error.message}`);
    }
}


  
}
module.exports = new CustomerService();
