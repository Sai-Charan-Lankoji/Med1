const addressService = require("../services/customeraddress.service");

// Standardized response helper
const sendResponse = (res, status, success, message, data = null, error = null) => {
  res.status(status).json({ status, success, message, data, error });
};

class AddressController {
  async createAddress(req, res) {
    try {
      const result = await addressService.createAddress(req.body);
      sendResponse(res, result.status, result.success, result.message, result.data, result.error);
    } catch (error) {
      sendResponse(res, 500, false, "Internal Server Error", null, {
        code: "SERVER_ERROR",
        details: error.message || "An unexpected error occurred",
      });
    }
  }

  async getCustomerAddresses(req, res) {
    try {
      const customerId = req.params.customerId;
      if (!customerId) {
        return sendResponse(res, 400, false, "Customer ID is required", null, {
          code: "VALIDATION_ERROR",
          details: "Customer ID is required in the URL parameters",
        });
      }
      const result = await addressService.getCustomerAddresses(customerId);
      sendResponse(res, result.status, result.success, result.message, result.data, result.error);
    } catch (error) {
      sendResponse(res, 500, false, "Internal Server Error", null, {
        code: "SERVER_ERROR",
        details: error.message || "An unexpected error occurred",
      });
    }
  }

  async getAddressById(req, res) {
    try {
      const addressId = req.params.addressId;
      if (!addressId) {
        return sendResponse(res, 400, false, "Address ID is required", null, {
          code: "VALIDATION_ERROR",
          details: "Address ID is required in the URL parameters",
        });
      }
      const result = await addressService.getAddressById(addressId);
      sendResponse(res, result.status, result.success, result.message, result.data, result.error);
    } catch (error) {
      sendResponse(res, 500, false, "Internal Server Error", null, {
        code: "SERVER_ERROR",
        details: error.message || "An unexpected error occurred",
      });
    }
  }

  async updateAddress(req, res) {
    try {
      const addressId = req.params.addressId;
      if (!addressId) {
        return sendResponse(res, 400, false, "Address ID is required", null, {
          code: "VALIDATION_ERROR",
          details: "Address ID is required in the URL parameters",
        });
      }
      const result = await addressService.updateAddress(addressId, req.body);
      sendResponse(res, result.status, result.success, result.message, result.data, result.error);
    } catch (error) {
      sendResponse(res, 500, false, "Internal Server Error", null, {
        code: "SERVER_ERROR",
        details: error.message || "An unexpected error occurred",
      });
    }
  }

  async deleteAddress(req, res) {
    try {
      const addressId = req.params.addressId;
      if (!addressId) {
        return sendResponse(res, 400, false, "Address ID is required", null, {
          code: "VALIDATION_ERROR",
          details: "Address ID is required in the URL parameters",
        });
      }
      const result = await addressService.deleteAddress(addressId);
      sendResponse(res, result.status, result.success, result.message, result.data, result.error);
    } catch (error) {
      sendResponse(res, 500, false, "Internal Server Error", null, {
        code: "SERVER_ERROR",
        details: error.message || "An unexpected error occurred",
      });
    }
  }
}

module.exports = new AddressController();