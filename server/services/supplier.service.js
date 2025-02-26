// services/supplierService.js
const Supplier  = require("../models/supplier.model");

/**
 * Create a new supplier
 * @param {Object} data - Supplier data
 * @returns {Object} - Created supplier
 * @throws {Error} - If validation or creation fails
 */
const createSupplier = async (data) => {
  const { name, contact_info, gstin, address } = data;

  if (!name) {
    throw new Error("VALIDATION_ERROR: Name field is required");
  }

  const supplier = await Supplier.create({
    name: name,
    contact_info: contact_info,
    gstin: gstin,
    address: address,
  });

  return {
    supplier_id: supplier.supplier_id,
    name: supplier.name,
    contact_info: supplier.contact_info,
    gstin: supplier.gstin,
    address: supplier.address,
  };
};

/**
 * Get all suppliers
 * @returns {Array} - List of suppliers
 */
const getAllSuppliers = async () => {
  const suppliers = await Supplier.findAll();
  return suppliers.map((s) => ({
    supplier_id: s.supplier_id,
    name: s.name,
    contact_info: s.contact_info,
    gstin: s.gstin,
    address: s.address,
  }));
};

/**
 * Get supplier by ID
 * @param {string} id - Supplier UUID
 * @returns {Object} - Supplier details
 * @throws {Error} - If supplier not found
 */
const getSupplierById = async (id) => {
  const supplier = await Supplier.findByPk(id);
  if (!supplier) {
    throw new Error("NOT_FOUND: Supplier with this ID does not exist");
  }

  return {
    supplier_id: supplier.supplier_id,
    name: supplier.name,
    contact_info: supplier.contact_info,
    gstin: supplier.gstin,
    address: supplier.address,
  };
};

module.exports = { createSupplier, getAllSuppliers, getSupplierById };