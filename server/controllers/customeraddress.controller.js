const addressService = require('../services/customeraddress.service');

class AddressController {
  async createAddress(req, res) {
    const result = await addressService.createAddress(req.body);
    res.status(result.status).json({
      success: result.success,
      message: result.message,
      data: result.data,
      ...(result.error && { error: result.error }), // Add error only if it exists
    });
  }

  async getCustomerAddresses(req, res) {
    try {
      const customerId = req.params.id;
      const result = await addressService.getCustomerAddresses(customerId);
      res.status(result.status).json({
        success: result.success,
        message: result.message,
        data: result.data,
        ...(result.error && { error: result.error }), // Add error only if it exists
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve customer addresses',
        error: error.message,
      });
    }
  }
}

module.exports = new AddressController();