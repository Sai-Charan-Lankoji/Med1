import { dataSource } from "@medusajs/medusa/dist/loaders/database" 
import { ApparelDesign } from "../models/apparelDesign";
const ApparelDesignRepository = dataSource.getRepository(ApparelDesign).extend({
  async createApparelDesign(data: Partial<ApparelDesign>): Promise<ApparelDesign> {
    try {
      const ApparelDesign = this.create(data);
      return await this.save(ApparelDesign);
    } catch (error) {
      console.error("Error creating ApparelDesign:", error);
      throw new Error("Failed to create ApparelDesign");
    }
  },


  async getApparelDesign(id: string): Promise<ApparelDesign> {
    try {
      return await this.findOneOrFail({ where: { id } });
    } catch (error) {
      console.error("Error fetching ApparelDesign:", error);
      throw new Error("Failed to fetch ApparelDesign");
    }
  },

  async getApparelDesigns(): Promise<[ApparelDesign[], number]> {
    try {
      const [ApparelDesigns, count] = await this.findAndCount({});
      return [ApparelDesigns, count];
    } catch (error) {
      console.error("Error fetching ApparelDesigns:", error);
      throw new Error("Failed to fetch ApparelDesigns");
    }
  },
});

export default ApparelDesignRepository;
