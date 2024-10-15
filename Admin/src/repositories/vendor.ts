import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { Vendor } from "../models/vendor"

const VendorRepository = dataSource.getRepository(Vendor).extend({
  async createVendor(data: Partial<Vendor>): Promise<Vendor> {
    try {
      const vendor = this.create(data);
      return await this.save(vendor);
    } catch (error) {
      console.error("Error creating vendor:", error);
      throw new Error("Failed to create vendor");
    }
  },

  async updateVendor(id: string, data: Partial<Vendor>): Promise<Vendor> {
    try {
      const vendor = await this.findOneOrFail({ where: { id } });
      //ensureIdentity(data)
      Object.assign(vendor, data);
      return await this.save(vendor);
    } catch (error) {
      console.error("Error updating vendor:", error);
      throw new Error("Failed to update vendor");
    }
  },

  async deleteVendor(id: string): Promise<void> {
    try {
      const vendor = await this.findOneOrFail({ where: { id } });
      await this.remove(vendor);
    } catch (error) {
      console.error("Error deleting vendor:", error);
      throw new Error("Failed to delete vendor");
    }
  },

  async getVendor(id: string): Promise<Vendor> {
    try {
      return await this.findOneOrFail({ where: { id } });
    } catch (error) {
      console.error("Error fetching vendor:", error);
      throw new Error("Failed to fetch vendor");
    }
  },

  async getVendors(): Promise<[Vendor[], number]> {
    try {
      const [vendors, count] = await this.findAndCount({});
      return [vendors, count];
    } catch (error) {
      console.error("Error fetching vendors:", error);
      throw new Error("Failed to fetch vendors");
    }
  },

  async findVendor(selector: Partial<Vendor>): Promise<Vendor | undefined> {
    try {
      return await this.findOne({ where: selector });
    } catch (error) {
      console.error("Error finding vendor:", error);
      throw new Error("Failed to find vendor");
    }
  }
});

export default VendorRepository;
