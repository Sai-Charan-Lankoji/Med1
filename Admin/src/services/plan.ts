import { TransactionBaseService } from "@medusajs/medusa";
import { Plan } from "../models/plan";
import PlanRepository from "../repositories/plan";
import { EntityManager } from "typeorm";

class PlanService extends TransactionBaseService {
    private readonly planRepository_: typeof PlanRepository;

    public runAtomicPhase<T>(
        callback: (manager: EntityManager) => Promise<T>
      ): Promise<T> {
        return this.atomicPhase_(callback);
      }
    
      constructor(container) {
        super(container);
        this.manager_ = container.manager;
        this.planRepository_ = container.planRepository;
      }
    

    async create(data: Partial<Plan>): Promise<Plan> {
        return await this.atomicPhase_(async (manager) => {
            const planRepository = manager.withRepository(this.planRepository_);
            
            const plan = planRepository.create({
                name: data.name,
                description: data.description || null,
                price: data.price,
                features: data.features || [],
                isActive: data.isActive ?? true,
            });

            return await planRepository.save(plan);
        });
    }

    async update(id: string, data: Partial<Plan>): Promise<Plan> {
        return await this.atomicPhase_(async (manager) => {
            const planRepository = manager.withRepository(this.planRepository_);
            
            const plan = await planRepository.findOne({ where: { id } });
            
            if (!plan) {
                throw new Error(`Plan with id ${id} not found`);
            }

            Object.assign(plan, data);
            
            return await planRepository.save(plan);
        });
    }

    async list(
        filters: { 
            isActive?: boolean, 
            duration?: string 
        } = {}, 
        config: { 
            skip?: number, 
            take?: number 
        } = {}
    ): Promise<Plan[]> {
        return await this.planRepository_.find({
            where: {
                ...(filters.isActive !== undefined && { isActive: filters.isActive }),
                ...(filters.duration && { duration: filters.duration }),
            },
            skip: config.skip,
            take: config.take,
        });
    }

    async retrieve(id: string): Promise<Plan> {
        const plan = await this.planRepository_.findOne({ 
            where: { id } 
        });

        if (!plan) {
            throw new Error(`Plan with id ${id} not found`);
        }

        return plan;
    }

    async delete(id: string): Promise<void> {
        await this.atomicPhase_(async (manager) => {
            const planRepository = manager.withRepository(this.planRepository_);
            
            await planRepository.softDelete(id);
        });
    }
}

export default PlanService;