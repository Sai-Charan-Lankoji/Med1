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
    const customerId = req.params.customerId;
    const result = await addressService.getCustomerAddresses(customerId);
    res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data,
      ...(result.error && { error: result.error }),
    });
  }

  async getAddressById(req, res) {
    const addressId = req.params.addressId;
    const result = await addressService.getAddressById(addressId);
    res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data,
      ...(result.error && { error: result.error }),
    });
  }

  async updateAddress(req, res) {
    const addressId = req.params.addressId;
    const updateData = req.body;
    const result = await addressService.updateAddress(addressId, updateData);
    res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data,
      ...(result.error && { error: result.error }),
    });
  }

  async deleteAddress(req, res) {
    const addressId = req.params.addressId;
    const result = await addressService.deleteAddress(addressId);
    res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data,
      ...(result.error && { error: result.error }),
    });
  }
}

module.exports = new AddressController();