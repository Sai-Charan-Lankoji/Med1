import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { Plan } from "../models/plan"

const PlanRepository = dataSource.getRepository(Plan).extend({
    async createVendor(data: Partial<Plan>): Promise<Plan> {
        try {
          const plan = this.create(data);
          return await this.save(plan);
        } catch (error) {
          console.error("Error creating plan:", error);
          throw new Error("Failed to create plan");
        }
      },
});

export default PlanRepository;
