const Vendor = require("../models/vendor.model");
const Address = require("../models/address.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

class VendorService {
  async getAllVendors() {
    return await Vendor.findAll({ include: ["address"] });
  }

  async getVendorById(id) {
    const vendor = await Vendor.findByPk(id, { include: ["address"] });
    if (!vendor) {
      throw new Error("Vendor not found.");
    }
    return vendor;
  }

  async createVendor(data) {
    try {
      // Check for existing vendor with the same email
      const existingVendor = await Vendor.findOne({
        where: { contact_email: data.contact_email },
      });

      if (existingVendor) {
        throw new Error("Vendor with this email already exists.");
      }

      // Generate a unique ID for the vendor
      const vendorId = generateEntityId("vendor");

      // Hash the vendor's password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create the vendor
      const vendor = await Vendor.create({
        id: vendorId,
        ...data,
        password: hashedPassword,
      });

      console.log("Vendor created: ", vendor);

      // Create vendor address if provided
      if (data.vendorAddressData) {
        const vendorAddress = {
          id: generateEntityId("address"),
          vendor_address_id: vendor.id, // Associate the address with the vendor
          company: data.company_name,
          first_name: data.vendorAddressData.first_name,
          last_name: data.vendorAddressData.last_name,
          address_1: data.vendorAddressData.address_1,
          address_2: data.vendorAddressData.address_2,
          city: data.vendorAddressData.city,
          province: data.vendorAddressData.province,
          postal_code: data.vendorAddressData.postal_code,
          phone: data.vendorAddressData.phone,
        };
        console.log("Vendor Address: ", vendorAddress);
        await Address.create(vendorAddress);
      }

      // Create registration address if provided
      if (data.registrationAddressData) {
        const registrationAddress = {
          id: generateEntityId("address"),
          registration_address_id: vendor.id, // Associate the address with the vendor
          company: data.company_name,
          first_name: data.registrationAddressData.first_name,
          last_name: data.registrationAddressData.last_name,
          address_1: data.registrationAddressData.address_1,
          address_2: data.registrationAddressData.address_2,
          city: data.registrationAddressData.city,
          province: data.registrationAddressData.province,
          postal_code: data.registrationAddressData.postal_code,
          phone: data.registrationAddressData.phone,
        };
        console.log("Registration Address: ", registrationAddress);
        await Address.create(registrationAddress);
      }

      return vendor;
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // Handle Sequelize validation errors
        throw new Error(error.errors.map((e) => e.message).join(", "));
      }
      throw error;
    }
  }

  async updateVendor(id, data) {
    const vendor = await this.getVendorById(id);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await vendor.update(data);

    // Update or create vendor address
    if (data.vendorAddressData) {
      const vendorAddress = await Address.findOne({ where: { vendor_id: id } });
      if (vendorAddress) {
        await vendorAddress.update(data.vendorAddressData);
      } else {
        await Address.create({
          id: generateEntityId("address"),
          vendor_id: id,
          ...data.vendorAddressData,
        });
      }
    }

    return this.getVendorById(id);
  }

  async deleteVendor(id) {
    const vendor = await this.getVendorById(id);
    return await vendor.destroy({ force: true });
  }
}

module.exports = new VendorService();
