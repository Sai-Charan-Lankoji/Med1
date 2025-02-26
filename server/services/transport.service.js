// services/transporterService.js
const Transporter  = require("../models/transporter.model");

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
    name: name,
    contact_info: contact_info,
    gstin: gstin,
    address: address,
  });

  return {
    transporter_id: transporter.transporter_id,
    name: transporter.name,
    contact_info: transporter.contact_info,
    gstin: transporter.gstin,
    address: transporter.address,
  };
};

/**
 * Get all transporters
 * @returns {Array} - List of transporters
 */
const getAllTransporters = async () => {
  const transporters = await Transporter.findAll();
  return transporters.map((t) => ({
    transporter_id: t.transporter_id,
    name: t.name,
    contact_info: t.contact_info,
    gstin: t.gstin,
    address: t.address,
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
    transporter_id: transporter.transporter_id,
    name: transporter.name,
    contact_info: transporter.contact_info,
    gstin: transporter.gstin,
    address: transporter.address,
  };
};

module.exports = { createTransporter, getAllTransporters, getTransporterById };