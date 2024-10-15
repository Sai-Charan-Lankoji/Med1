import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { ApparelUpload } from "../models/apparelUpload";
const ApparelUploadRepository = dataSource.getRepository(ApparelUpload).extend({
  async createApparelUpload(data: Partial<ApparelUpload>): Promise<ApparelUpload> {
    try {
      const ApparelUpload = this.create(data);
      return await this.save(ApparelUpload);
    } catch (error) {
      console.error("Error creating ApparelUpload:", error);
      throw new Error("Failed to create ApparelUpload");
    }
  },


  async getApparelUpload(id: string): Promise<ApparelUpload> {
    try {
      return await this.findOneOrFail({ where: { id } });
    } catch (error) {
      console.error("Error fetching ApparelUpload:", error);
      throw new Error("Failed to fetch ApparelUpload");
    }
  },

  async getApparelUploads(): Promise<[ApparelUpload[], number]> {
    try {
      const [ApparelUploads, count] = await this.findAndCount({});
      return [ApparelUploads, count];
    } catch (error) {
      console.error("Error fetching ApparelUploads:", error);
      throw new Error("Failed to fetch ApparelUploads");
    }
  },
});

export default ApparelUploadRepository;
