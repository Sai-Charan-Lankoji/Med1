// services/transporterService.js
const { Transporter } = require("../models/transporter.model");

/**
 * Create a new transporter
 * @param {Object} data - Transporter data
 * @returns {Object} - Created transporter
 * @throws {Error} - If validation or creation fails
 */
const createTransporter = async (data) => {
  const { name, contact_info, gstin, address } = data;

  if (!name) {
    throw new Error("VALIDATION_ERROR: Name field is required");
  }

  const transporter = await Transporter.create({
    Name: name,
    ContactInfo: contact_info,
    GSTIN: gstin,
    Address: address,
  });

  return {
    transporter_id: transporter.TransporterID,
    name: transporter.Name,
    contact_info: transporter.ContactInfo,
    gstin: transporter.GSTIN,
    address: transporter.Address,
  };
};

/**
 * Get all transporters
 * @returns {Array} - List of transporters
 */
const getAllTransporters = async () => {
  const transporters = await Transporter.findAll();
  return transporters.map((t) => ({
    transporter_id: t.TransporterID,
    name: t.Name,
    contact_info: t.ContactInfo,
    gstin: t.GSTIN,
    address: t.Address,
  }));
};

/**
 * Get transporter by ID
 * @param {string} id - Transporter UUID
 * @returns {Object} - Transporter details
 * @throws {Error} - If transporter not found
 */
const getTransporterById = async (id) => {
  const transporter = await Transporter.findByPk(id);
  if (!transporter) {
    throw new Error("NOT_FOUND: Transporter with this ID does not exist");
  }

  return {
    transporter_id: transporter.TransporterID,
    name: transporter.Name,
    contact_info: transporter.ContactInfo,
    gstin: transporter.GSTIN,
    address: transporter.Address,
  };
};

module.exports = { createTransporter, getAllTransporters, getTransporterById };