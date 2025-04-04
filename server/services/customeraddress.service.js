const Address = require("../models/customeraddress.model");

class AddressService {
  // Validation Helper
  validateAddressData(data, isUpdate = false) {
    const {
      customer_id,
      customer_email,
      first_name,
      last_name,
      phone_number,
      street,
      city,
      state,
      pincode,
      country,
      address_type,
      is_default,
    } = data;

    if (!isUpdate) {
      const requiredFields = { customer_id, customer_email, first_name, last_name, phone_number, street, city, state, pincode, country };
      for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
          throw new Error(`${key} is required`);
        }
      }
    }

    if (customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
      throw new Error("Invalid email format");
    }
    if (phone_number && !/^[0-9]{10,15}$/.test(phone_number)) {
      throw new Error("Phone number must be 10-15 digits");
    }
    if (pincode && !/^\d{5,10}$/.test(pincode)) {
      throw new Error("Pincode must be 5-10 digits");
    }
    if (address_type && !["billing", "shipping"].includes(address_type)) {
      throw new Error("Address type must be either 'billing' or 'shipping'");
    }
    if (is_default !== undefined && typeof is_default !== "boolean") {
      throw new Error("is_default must be a boolean value");
    }
  }

  async createAddress(addressData) {
    try {
      this.validateAddressData(addressData);
      const { customer_id, customer_email, first_name, last_name, phone_number, street, landmark, city, state, pincode, country, address_type, is_default } = addressData;

      // Check for duplicate address
      const existingAddress = await Address.findOne({
        where: { customer_id, street, city, state, pincode, country },
      });
      if (existingAddress) {
        return {
          status: 409,
          success: false,
          message: "Address already exists",
          data: null,
          error: { code: "DUPLICATE_ADDRESS", details: "This address is already registered for the customer" },
        };
      }

      const newAddress = await Address.create({
        customer_id,
        customer_email,
        first_name,
        last_name,
        phone_number,
        street,
        landmark: landmark || null,
        city,
        state,
        pincode,
        country,
        address_type: address_type || "shipping",
        is_default: is_default || false,
      });

      return {
        status: 201,
        success: true,
        message: "Address created successfully",
        data: newAddress,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: "Internal Server Error",
        data: null,
        error: { code: "SERVER_ERROR", details: error.message || "An unexpected error occurred" },
      };
    }
  }

  async getCustomerAddresses(customerId) {
    try {
      if (!customerId) {
        return {
          status: 400,
          success: false,
          message: "Customer ID is required",
          data: null,
          error: { code: "VALIDATION_ERROR", details: "Customer ID is required" },
        };
      }

      const addresses = await Address.findAll({ where: { customer_id: customerId } });
      if (!addresses || addresses.length === 0) {
        return {
          status: 404,
          success: false,
          message: "No addresses found",
          data: null,
          error: { code: "NOT_FOUND", details: "No addresses found for the given customer ID" },
        };
      }

      return {
        status: 200,
        success: true,
        message: "Customer addresses retrieved successfully",
        data: addresses,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: "Internal Server Error",
        data: null,
        error: { code: "SERVER_ERROR", details: error.message || "An unexpected error occurred" },
      };
    }
  }

  async getAddressById(addressId) {
    try {
      if (!addressId) {
        return {
          status: 400,
          success: false,
          message: "Address ID is required",
          data: null,
          error: { code: "VALIDATION_ERROR", details: "Address ID is required" },
        };
      }

      const address = await Address.findByPk(addressId);
      if (!address) {
        return {
          status: 404,
          success: false,
          message: "Address not found",
          data: null,
          error: { code: "NOT_FOUND", details: "No address found with the given ID" },
        };
      }

      return {
        status: 200,
        success: true,
        message: "Address retrieved successfully",
        data: address,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: "Internal Server Error",
        data: null,
        error: { code: "SERVER_ERROR", details: error.message || "An unexpected error occurred" },
      };
    }
  }

  async updateAddress(addressId, updateData) {
    try {
      if (!addressId) {
        return {
          status: 400,
          success: false,
          message: "Address ID is required",
          data: null,
          error: { code: "VALIDATION_ERROR", details: "Address ID is required" },
        };
      }

      this.validateAddressData(updateData, true);
      const address = await Address.findByPk(addressId);
      if (!address) {
        return {
          status: 404,
          success: false,
          message: "Address not found",
          data: null,
          error: { code: "NOT_FOUND", details: "No address found with the given ID" },
        };
      }

      const { customer_email, first_name, last_name, phone_number, street, landmark, city, state, pincode, country, address_type, is_default } = updateData;
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
          message: "Address not found",
          data: null,
          error: { code: "NOT_FOUND", details: "No address found with the given ID" },
        };
      }

      return {
        status: 200,
        success: true,
        message: "Address updated successfully",
        data: updatedAddresses[0],
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: "Internal Server Error",
        data: null,
        error: { code: "SERVER_ERROR", details: error.message || "An unexpected error occurred" },
      };
    }
  }

  async deleteAddress(addressId) {
    try {
      if (!addressId) {
        return {
          status: 400,
          success: false,
          message: "Address ID is required",
          data: null,
          error: { code: "VALIDATION_ERROR", details: "Address ID is required" },
        };
      }

      const address = await Address.findByPk(addressId);
      if (!address) {
        return {
          status: 404,
          success: false,
          message: "Address not found",
          data: null,
          error: { code: "NOT_FOUND", details: "No address found with the given ID" },
        };
      }

      if (address.is_default) {
        const otherAddresses = await Address.findAll({
          where: { customer_id: address.customer_id, id: { [Address.sequelize.Op.ne]: addressId } },
          order: [["created_at", "ASC"]],
        });
        if (otherAddresses.length > 0) {
          await Address.update({ is_default: true }, { where: { id: otherAddresses[0].id } });
        }
      }

      await Address.destroy({ where: { id: addressId } });
      return {
        status: 200,
        success: true,
        message: "Address deleted successfully",
        data: null,
      };
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: "Internal Server Error",
        data: null,
        error: { code: "SERVER_ERROR", details: error.message || "An unexpected error occurred" },
      };
    }
  }
}

module.exports = new AddressService();