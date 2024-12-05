import { EntityManager, Repository } from "typeorm";
import { Plan } from "../models/plan";
import { MedusaError } from "@medusajs/utils";
import { TransactionBaseService } from "@medusajs/medusa";
import { FindConfig } from "@medusajs/medusa/dist/types/common";
import PlanRepository, { CreatePlanData } from "../repositories/plan";
import { Lifetime } from "awilix"
import { generateEntityId } from "@medusajs/medusa/dist/utils";

class PlanService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly manager_: EntityManager;
  protected readonly PlanRepository_: Repository<Plan>;

  constructor(container) {
    super(container);

    this.manager_ = container.manager;
    this.PlanRepository_ = container.manager.getRepository(PlanRepository);
  }
  

  async create(data: CreatePlanData): Promise<Plan> {
    return await this.atomicPhase_(async (transactionManager) => {
      const PlanRepo = transactionManager.getRepository(Plan);
      const plan = PlanRepo.create(data);
      plan.id = generateEntityId(plan.id, "plan");
      const created = await PlanRepo.save(plan);
      return created;
    });
  }

  async retrieve(id: string): Promise<Plan> {
    return await this.atomicPhase_(async (transactionManager) => {
      const PlanRepo = transactionManager.getRepository(Plan);
      const plan = await PlanRepo.findOne({
        where: { id },
      });

      if (!plan) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Vendor with id ${id} was not found.`
        );
      }
      return plan;
    });
  }

  async list(config: FindConfig<Plan> = {}): Promise<Plan[]> {
    const planRepo = this.manager_.getRepository(Plan);
    return await planRepo.find(config);
  }

  async update(id: string, data: any): Promise<Plan> {
    return await this.atomicPhase_(async (transactionManager) => {
      const PlanRepo = transactionManager.getRepository(Plan);
      const plan = await PlanRepo.findOne({ where: { id } });
      if (!plan) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Plan not found");
      }
      Object.assign(plan, data);
      const updated = await PlanRepo.save(plan);
      return updated;
    });
  }

  async delete(id: string): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      const planRepo = transactionManager.getRepository(Plan);
    
      const result = await planRepo.createQueryBuilder()
        .delete()
        .from(Plan)
        .where("id = :id", { id })
        .execute();

      if (result.affected === 0) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Plan with id ${id} not found`
        );
      }
    });
  }


}

export default PlanService;

