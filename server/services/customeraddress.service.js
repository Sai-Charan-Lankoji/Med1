const Address = require('../models/customeraddress.model');

class AddressService {
  async createAddress(addressData) {
    try {
      // Validate required fields
      const { customer_id, customer_email, street, city, state, pincode } = addressData;
      if (!customer_id || !customer_email || !street || !city || !state || !pincode) {
        return {
          status: 400, // Bad Request
          success: false,
          message: 'Invalid request parameters',
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            details: 'All fields (customer_id, customer_email, street, city, state, pincode) are required',
          },
        };
      }

      // Validate email format (simple regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer_email)) {
        return {
          status: 422, // Unprocessable Entity
          success: false,
          message: 'Invalid input',
          data: null,
          error: {
            code: 'INVALID_DATA',
            details: 'Customer email is not in a valid format',
          },
        };
      }

      // Create and save address
      const newAddress = new Address(addressData);
      const savedAddress = await newAddress.save();
      return {
        status: 201, // Created
        success: true,
        message: 'Resource created successfully',
        data: savedAddress,
      };
    } catch (error) {
      // Handle specific MongoDB errors
      if (error.name === 'MongoServerError' && error.code === 11000) {
        return {
          status: 409, // Conflict
          success: false,
          message: 'Conflict detected',
          data: null,
          error: {
            code: 'RESOURCE_EXISTS',
            details: 'An address with this customer_id already exists',
          },
        };
      }

      // Generic server error
      return {
        status: 500, // Internal Server Error
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: {
          code: 'SERVER_ERROR',
          details: error.message || 'An unexpected error occurred',
        },
      };
    }
  }
  async getCustomerAddresses(customerId) {
    try {
      const addresses = await Address.findAll({ customer_id: customerId });
      if (addresses.length === 0) {
        return {
          status: 404, // Not Found
          success: false,
          message: 'Customer addresses not found',
          data: null,
          error: {
            code: 'NOT_FOUND',
            details: 'No addresses found for the given customer ID',
          },
        };
      }
      return {
        status: 200, // OK
        success: true,
        message: 'Customer addresses retrieved successfully',
        data: addresses,
      };
    } catch (error) {
      return {
        status: 500, // Internal Server Error
        success: false,
        message: 'Internal Server Error',
        data: null,
        error: {
          code: 'SERVER_ERROR',
          details: error.message || 'An unexpected error occurred',
        },
      };
    }
  }
}

module.exports = new AddressService();