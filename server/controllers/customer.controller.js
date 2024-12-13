const customerService = require("../services/customer.service");

// create a new customer
const createCustomer = async (req, res) => {
  try {
    const { email, first_name, last_name, password, phone, vendor_id } =
      req.body;
    const customer = await customerService.createCustomer({
      email,
      first_name,
      last_name,
      password,
      phone,
      vendor_id,
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login customer
const LoginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await customerService.loginCustomer({ email, password });
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Get customer by ID
const getCustomerDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerDetails(id);
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// get customer by vendor_id
const customerByVendorId = async (req, res) => {
  try {
    const { vendor_id } = req.params;
    console.log("Vendor ID received:", vendor_id); // Debugging
    const customers = await customerService.getCustomerByVendorId(vendor_id);
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers by vendor ID:", error.message);
    res.status(404).json({ error: error.message });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.list();
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCustomerByEmail = async (req, res) => {
  try {
    const email = req.params; // Extract email from path parameters
    if (!email) {
      throw new Error("Email query parameter is required.");
    }

    const customer = await customerService.getCustomerByEmail(email);
    res.status(200).json(customer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
module.exports = {
  getAllCustomers,
  createCustomer,
  LoginCustomer,
  getCustomerDetails,
  getCustomerByEmail,
  customerByVendorId,
};
