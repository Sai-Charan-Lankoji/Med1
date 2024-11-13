import { VendorUser } from "../models/vendor-user";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const VendorUserRepository = dataSource.getRepository(VendorUser).extend({
  async createVendorUser(data: Partial<VendorUser>): Promise<VendorUser> {
    const vendorUser = this.create(data);
    return await this.save(vendorUser);
  },

  async getVendor(id: string): Promise<VendorUser> {
    try {
      return await this.find({ where: { vendor_id: id } });
    } catch (error) {
      console.error("Error fetching vendor:", error);
      throw new Error("Failed to fetch vendor");
    }
  }
});

export default VendorUserRepository;
