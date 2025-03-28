const e = require("express");
const vendorService = require("../services/vendor.service");

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await vendorService.getAllVendors();
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVendorById = async (req, res) => {
  try {
    const vendor = await vendorService.getVendorById(req.params.id);
    res.status(200).json(vendor);
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.createVendor = async (req, res) => {
  try {
    const vendor = await vendorService.createVendor(req.body);
    res.status(201).json({ success: true, vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateVendor = async (req, res) => {
  try {
    const vendor = await vendorService.updateVendor(req.params.id, req.body);
    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteVendor = async (req, res) => {
  try {
    await vendorService.deleteVendor(req.params.id);
    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

exports.getVendorAnalytics = async (req, res) => {
  try {
    const analytics = await vendorService.getVendorAnalytics(); // Fixed: No `req.params.id` needed here
    res.status(analytics.statusCode).json(analytics); // Use statusCode from service response
  } catch (error) {
    res.status(error.statusCode || 500).json(error);
  }
};

exports.getStoreCommissionBreakdownByVendor = async (req, res) => {
  try {
    const breakdown = await vendorService.getStoreCommissionBreakdownByVendor(req.params.vendorId);
    res.status(breakdown.statusCode).json(breakdown); // Use statusCode from service response
  } catch (error) {
    res.status(error.statusCode || 500).json(error);
  }
};

exports.updateVendorPlan = async (req, res) => {
  try {
    const { plan_id, plan } = req.body;
    const updatedVendor = await vendorService.updateVendorPlan(req.params.id, { plan_id, plan });
    res.status(200).json({ success: true, vendor: updatedVendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};