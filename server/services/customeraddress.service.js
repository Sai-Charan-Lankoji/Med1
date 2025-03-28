const Address = require('../models/customeraddress.model');

class AddressService {
  // Create Address
  async createAddress(addressData) {
    try {
      const {
        customer_id,
        customer_email,
        first_name,
        last_name,
        phone_number,
        street,
        landmark,
        city,
        state,
        pincode,
        country,
        address_type,
        is_default,
      } = addressData;

      // Validate required fields
      if (
        !customer_id ||
        !customer_email ||
        !first_name ||
        !last_name ||
        !phone_number ||
        !street ||
        !city ||
        !state ||
        !pincode ||
        !country
      ) {
        return {
          status: 400,
          success: false,
          message: 'Invalid request parameters',
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            details:
              'All fields (customer_id, customer_email, first_name, last_name, phone_number, street, city, state, pincode, country) are required',
          },
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer_email)) {
        return {
          status: 422,
          success: false,
          message: 'Invalid input',
          data: null,
          error: {
            code: 'INVALID_DATA',
            details: 'Customer email is not in a valid format',
          },
        };
      }

      // Validate phone_number (10-15 digits)
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(phone_number)) {
        return {
          status: 422,
          success: false,
          message: 'Invalid input',
          data: null,
          error: {
            code: 'INVALID_DATA',
            details: 'Phone number must be 10-15 digits',
          },
        };
      }

      // Validate pincode (5-10 digits)
      const pincodeRegex = /^\d{5,10}$/;
      if (!pincodeRegex.test(pincode)) {
        return {
          status: 422,
          success: false,
          message: 'Invalid input',
          data: null,
          error: {
            code: 'INVALID_DATA',
            details: 'Pincode must be 5-10 digits',
          },
        };
      }

      // Validate address_type if provided
      if (address_type && !['billing', 'shipping'].includes(address_type)) {
        return {
          status: 422,
          success: false,
          message: 'Invalid input',
          data: null,
          error: {
            code: 'INVALID_DATA',
            details: 'address_type must be either "billing" or "shipping"',
          },
        };
      }

      // Validate is_default if provided
      if (is_default !== undefined && typeof is_default !== 'boolean') {
        return {
          status: 422,
          success: false,
          message: 'Invalid input',
          data: null,
          error: {
            code: 'INVALID_DATA',
            details: 'is_default must be a boolean value',
          },
        };
      }

      const newAddress = await Address.create({
        customer_id,
        customer_email,
        first_name,
        last_name,
        phone_number,
        street,
        landmark: landmark || null, // Optional field
        city,
        state,
        pincode,
        country,
        address_type: address_type || null,
        is_default: is_default || false,
      });

      return {
        status: 201,
        success: true,
        message: 'Address created successfully',
        data: newAddress,
      };
    } catch (error) {
      return {
        status: 500,
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

  // Get All Addresses for a Customer
  async getCustomerAddresses(customerId) {
    try {
      if (!customerId) {
        return {
          status: 400,
          success: false,
          message: 'Invalid request parameters',
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            details: 'Customer ID is required',
          },
        };
      }

      const addresses = await Address.findAll({
        where: { customer_id: customerId },
      });

      if (!addresses || addresses.length === 0) {
        return {
          status: 404,
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
        status: 200,
        success: true,
        message: 'Customer addresses retrieved successfully',
        data: addresses,
      };
    } catch (error) {
      return {
        status: 500,
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

  // Get Single Address by ID
  async getAddressById(addressId) {
    try {
      if (!addressId) {
        return {
          status: 400,
          success: false,
          message: 'Invalid request parameters',
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            details: 'Address ID is required',
          },
        };
      }

      const address = await Address.findByPk(addressId);
      if (!address) {
        return {
          status: 404,
          success: false,
          message: 'Address not found',
          data: null,
          error: {
            code: 'NOT_FOUND',
            details: 'No address found with the given ID',
          },
        };
      }

      return {
        status: 200,
        success: true,
        message: 'Address retrieved successfully',
        data: address,
      };
    } catch (error) {
      return {
        status: 500,
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

  // Update Address
  async updateAddress(addressId, updateData) {
    try {
      if (!addressId) {
        return {
          status: 400,
          success: false,
          message: 'Invalid request parameters',
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            details: 'Address ID is required',
          },
        };
      }

      const {
        customer_email,
        first_name,
        last_name,
        phone_number,
        street,
        landmark,
        city,
        state,
        pincode,
        country,
        address_type,
        is_default,
      } = updateData;

      // Validate optional fields if provided
      if (customer_email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customer_email)) {
          return {
            status: 422,
            success: false,
            message: 'Invalid input',
            data: null,
            error: {
              code: 'INVALID_DATA',
              details: 'Customer email is not in a valid format',
            },
          };
        }
      }

      if (phone_number) {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone_number)) {
          return {
            status: 422,
            success: false,
            message: 'Invalid input',
            data: null,
            error: {
              code: 'INVALID_DATA',
              details: 'Phone number must be 10-15 digits',
            },
          };
        }
      }

      if (pincode) {
        const pincodeRegex = /^\d{5,10}$/;
        if (!pincodeRegex.test(pincode)) {
          return {
            status: 422,
            success: false,
            message: 'Invalid input',
            data: null,
            error: {
              code: 'INVALID_DATA',
              details: 'Pincode must be 5-10 digits',
            },
          };
        }
      }

      if (address_type && !['billing', 'shipping'].includes(address_type)) {
        return {
          status: 422,
          success: false,
          message: 'Invalid input',
          data: null,
          error: {
            code: 'INVALID_DATA',
            details: 'address_type must be either "billing" or "shipping"',
          },
        };
      }

      if (is_default !== undefined && typeof is_default !== 'boolean') {
        return {
          status: 422,
          success: false,
          message: 'Invalid input',
          data: null,
          error: {
            code: 'INVALID_DATA',
            details: 'is_default must be a boolean value',
          },
        };
      }

      const [updatedCount, updatedAddresses] = await Address.update(
        {
          customer_email,
          first_name,
          last_name,
          phone_number,
          street,
          landmark,
          city,
          state,
          pincode,
          country,
          address_type,
          is_default,
          updated_at: new Date(),
        },
        { where: { id: addressId }, returning: true }
      );

      if (updatedCount === 0) {
        return {
          status: 404,
          success: false,
          message: 'Address not found',
          data: null,
          error: {
            code: 'NOT_FOUND',
            details: 'No address found with the given ID',
          },
        };
      }

      return {
        status: 200,
        success: true,
        message: 'Address updated successfully',
        data: updatedAddresses[0],
      };
    } catch (error) {
      return {
        status: 500,
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

  // Delete Address
  async deleteAddress(addressId) {
    try {
      if (!addressId) {
        return {
          status: 400,
          success: false,
          message: 'Invalid request parameters',
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            details: 'Address ID is required',
          },
        };
      }

      const address = await Address.findByPk(addressId);
      if (!address) {
        return {
          status: 404,
          success: false,
          message: 'Address not found',
          data: null,
          error: {
            code: 'NOT_FOUND',
            details: 'No address found with the given ID',
          },
        };
      }

      // If the address being deleted is the default, ensure another address is set as default
      if (address.is_default) {
        const otherAddresses = await Address.findAll({
          where: {
            customer_id: address.customer_id,
            id: { [Address.sequelize.Op.ne]: addressId },
          },
          order: [['created_at', 'ASC']],
        });

        if (otherAddresses.length > 0) {
          await Address.update(
            { is_default: true },
            { where: { id: otherAddresses[0].id } }
          );
        }
      }

      await Address.destroy({ where: { id: addressId } });

      return {
        status: 200,
        success: true,
        message: 'Address deleted successfully',
        data: null,
      };
    } catch (error) {
      return {
        status: 500,
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