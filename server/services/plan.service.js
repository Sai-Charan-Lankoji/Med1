const Plan = require("../models/plan.model");

class PlanService {
  async create(data) {
    try {
      const plan = await Plan.create(data); // Let the model handle ID generation
      return plan;
    } catch (error) {
      throw new Error(`Failed to create plan: ${error.message}`);
    }
  }

  async getPlanById(id) {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      throw new Error(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async list() {
    return await Plan.findAll();
  }

  async update(id, data) {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      throw new Error(`Plan with ID ${id} not found`);
    }
    return await plan.update(data);
  }

  async delete(id) {
    const result = await Plan.destroy({ where: { id } });
    if (!result) {
      throw new Error(`Plan with ID ${id} not found`);
    }
    return;
  }
}

module.exports = new PlanService(); // Singleton for easy usage
