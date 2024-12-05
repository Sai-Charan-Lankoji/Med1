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

  async findPlan(selector: Partial<Plan>): Promise<Plan | undefined> {
    try {
      return await this.findOne({ where: selector });
    } catch (error) {
      console.error("Error finding plan:", error);
      throw new Error("Failed to find plan");
    }
  },

  async createplan(data: CreatePlanData): Promise<Plan> {
    try {
      const plan = this.create(data);
      return await this.save(plan);
    } catch (error) {
      console.error("Error creating plan:", error);
      throw new Error("Failed to create plan");
    }
  },

  async updatePlan(id: string, data: any): Promise<Plan> {
    try {
      const plan = await this.findOne({ where: { id } });
      if (!plan) {
        throw new Error("Plan not found");
      }
      Object.assign(plan, data);
      return await this.save(plan);
    } catch (error) {
      console.error("Error updating plan:", error);
      throw new Error("Failed to update plan");
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const result = await this.delete(id);
      if (result.affected === 0) {
        throw new Error("Plan not found");
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      throw new Error("Failed to delete plan");
    }
  },
});

export default PlanRepository;
