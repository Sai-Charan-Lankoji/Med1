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
    const vendor = await Vendor.findByPk(id, {
      include: [
        {
          model: Address,
          as: "address", // Ensure alias matches the association
        },
      ],
    });
  
    if (!vendor) {
      throw new Error("Vendor not found.");
    }
  
    // Format the data
    return this.formatVendorData(vendor);
  }
  
  formatVendorData(vendor) {
    // Helper function to split fields based on the "-" symbol
    const splitField = (field) => {
      if (!field || !field.includes("-")) return { vendorValue: field, registrationValue: field };
      const [vendorValue, registrationValue] = field.split(" -").map((str) => str.trim());
      return { vendorValue, registrationValue };
    };
  
    // Extract and split address fields
    const address_1 = splitField(vendor.address[0]?.address_1);
    const address_2 = splitField(vendor.address[0]?.address_2);
    const city = splitField(vendor.address[0]?.city);
    const postal_code = splitField(vendor.address[0]?.postal_code);
    const province = splitField(vendor.address[0]?.province);
    const phone = splitField(vendor.address[0]?.phone);
  
    return {
      vendor: {
        company_name: vendor.company_name,
        password: vendor.password, // Avoid sending hashed passwords in production
        confirmPassword: vendor.password,
        contact_name: vendor.contact_name,
        contact_email: vendor.contact_email,
        contact_phone_number: vendor.contact_phone_number,
        registered_number: vendor.registered_number,
        tax_number: vendor.tax_number || "",
        business_type: vendor.business_type,
        plan: vendor.plan,
        plan_id: vendor.plan_id,
        vendorAddress: {
          address_1: address_1.vendorValue,
          address_2: address_2.vendorValue,
          city: city.vendorValue,
          postal_code: postal_code.vendorValue,
          province: province.vendorValue,
          phone: phone.vendorValue,
          first_name: vendor.address[0]?.first_name,
          last_name: vendor.address[0]?.last_name,
        },
        registrationAddress: {
          address_1: address_1.registrationValue,
          address_2: address_2.registrationValue,
          city: city.registrationValue,
          postal_code: postal_code.registrationValue,
          province: province.registrationValue,
          phone: phone.registrationValue,
        },
      },
    };
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
   return await vendor.update(data);
  }

  async deleteVendor(id) {
    const vendor = await this.getVendorById(id);
    return await vendor.destroy({ force: true });
  }
}

module.exports = new VendorService();
