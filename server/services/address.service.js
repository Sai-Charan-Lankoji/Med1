const Address = require("../models/address.model");
const Vendor = require("../models/vendor.model");
const crypto = require("crypto");

// Function to generate a custom ID
const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

class AddressService {
  async getAllAddresses() {
    return await Address.findAll();
  }

  async getAddressById(id) {
    const address = await Address.findByPk(id);
    if (!address) {
      throw new Error("Address not found.");
    }
    return address;
  }

  async createAddress(data) {
    const addressId = generateEntityId("address");
    const address = await Address.create({
      id: addressId,
      ...data,
    });
    return address;
  }

  async updateAddress(id, data) {
    const address = await this.getAddressById(id);
    await address.update(data);
    return address;
  }

  async deleteAddress(id) {
    const address = await this.getAddressById(id);
    return await address.destroy();
  }

  async createVendorWithAddress(vendorData) {
    try {
      // Validate email uniqueness
      const existingVendor = await Vendor.findOne({
        where: { contact_email: vendorData.contact_email },
      });

      if (existingVendor) {
        throw new Error("Vendor with this email already exists.");
      }

      const vendorId = generateEntityId("vendor");

      // Create vendor
      const vendor = await Vendor.create({
        id: vendorId,
        ...vendorData,
      });

      // Create vendor address
      if (vendorData.vendorAddressData) {
        const vendorAddress = {
          id: generateEntityId("address"),
          vendor_address_id: vendor.id,
          ...vendorData.vendorAddressData,
        };
        await Address.create(vendorAddress);
      }

      // Create registration address
      if (vendorData.registrationAddressData) {
        const registrationAddress = {
          id: generateEntityId("address"),
          registration_address_id: vendor.id,
          ...vendorData.registrationAddressData,
        };
        await Address.create(registrationAddress);
      }

      return vendor;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new AddressService();
 