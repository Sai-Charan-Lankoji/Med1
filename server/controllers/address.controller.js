const addressService = require("../services/address.service");

exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getAllAddresses();
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAddressById = async (req, res) => {
  try {
    const address = await addressService.getAddressById(req.params.id);
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const address = await addressService.createAddress(req.body);
    res.status(201).json({ success: true, address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const address = await addressService.updateAddress(req.params.id, req.body);
    res.status(200).json({ success: true, address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    await addressService.deleteAddress(req.params.id);
    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.createVendorWithAddress = async (req, res) => {
  try {
    const vendor = await addressService.createVendorWithAddress(req.body);
    res.status(201).json({ success: true, vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
