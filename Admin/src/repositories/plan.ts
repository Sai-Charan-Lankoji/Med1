import { dataSource } from "@medusajs/medusa/dist/loaders/database"
import { Plan } from "../models/plan"

export interface CreatePlanData {
  name: string;
  description?: string;
  price: number;
  features: string[];
  isActive?: boolean;
}
const PlanRepository = dataSource.getRepository(Plan).extend({
  async createplan(data: CreatePlanData): Promise<Plan> {
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
