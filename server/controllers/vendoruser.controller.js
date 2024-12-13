const vendorUserService = require("../services/vendoruser.service");

class VendorUserController {
  // Create a new VendorUser
  async createVendorUser(req, res) {
    try {
      const user = await vendorUserService.createVendorUser(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Update VendorUser
  async updateVendorUser(req, res) {
    try {
      const updatedUser = await vendorUserService.updateVendorUser(req.params.id, req.body);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Get VendorUser by ID
  async getVendorUser(req, res) {
    try {
      const user = await vendorUserService.getVendorUserById(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  // Delete VendorUser
  async deleteVendorUser(req, res) {
    try {
      const response = await vendorUserService.deleteVendorUser(req.params.id);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  // Get all users for a vendor
  async getUsersByVendor(req, res) {
    try {
      const users = await vendorUserService.getUsersByVendor(req.params.vendorId);
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new VendorUserController();
