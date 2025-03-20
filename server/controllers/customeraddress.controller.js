const addressService = require('../services/customeraddress.service');

class AddressController {
  async createAddress(req, res) {
    const result = await addressService.createAddress(req.body);
    res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data,
      ...(result.error && { error: result.error }),
    });
  }

  async getCustomerAddresses(req, res) {
    try {
      const customerId = req.params.customerId;
      const result = await addressService.getCustomerAddresses(customerId);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
        data: result.data,
        ...(result.error && { error: result.error }),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve customer addresses',
        error: error.message,
      });
    }
  }

  async getAddressById(req, res) {
    try {
      const addressId = req.params.id;
      const result = await addressService.getAddressById(addressId);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
        data: result.data,
        ...(result.error && { error: result.error }),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve address',
        error: error.message,
      });
    }
  }

  async updateAddress(req, res) {
    try {
      const addressId = req.params.id;
      const updateData = req.body;
      const result = await addressService.updateAddress(addressId, updateData);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
        data: result.data,
        ...(result.error && { error: result.error }),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update address',
        error: error.message,
      });
    }
  }

  async deleteAddress(req, res) {
    try {
      const addressId = req.params.id;
      const result = await addressService.deleteAddress(addressId);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
        data: result.data,
        ...(result.error && { error: result.error }),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete address',
        error: error.message,
      });
    }
  }
}

module.exports = new AddressController();