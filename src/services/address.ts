import { TransactionBaseService, buildQuery } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import AddressRepository from "../repositories/address";
import { Address } from "../models/address";
import { MedusaError } from "@medusajs/utils";

class AddressService extends TransactionBaseService {
    protected manager_: EntityManager;
    protected addressRepository_: typeof AddressRepository;

    public runAtomicPhase<T>(
        callback: (manager: EntityManager) => Promise<T>
    ): Promise<T> {
        return this.atomicPhase_(callback);
    }

    constructor(container) {
        super(container);
        this.manager_ = container.manager;
        this.addressRepository_ = container.addressRepository;
    }

    async list(
        selector?: Partial<Address>,
        config = { skip: 0, take: 20, relations: [] }
    ): Promise<[Address[], number]> {
        return await this.runAtomicPhase(async (manager) => {
            const addressRepo = manager.withRepository(this.addressRepository_);
            const query = buildQuery(selector, config);
            return await addressRepo.findAndCount(query);
        });
    }

    async retrieve(id: string): Promise<Address> {
        return await this.runAtomicPhase(async (manager) => {
            const addressRepo = manager.withRepository(this.addressRepository_);
            const address = await addressRepo.findOne({ where: { id } });

            if (!address) {
                throw new MedusaError(
                    MedusaError.Types.NOT_FOUND,
                    `Address with id ${id} was not found.`
                );
            }

            return address;
        });
    }

    async create(data: Partial<Address>): Promise<Address> {
        return await this.runAtomicPhase(async (manager) => {
            const addressRepo = manager.withRepository(this.addressRepository_);
            const newAddress = addressRepo.create(data);
            return await addressRepo.save(newAddress);
        });
    }

    async update(id: string, data: Partial<Address>): Promise<Address> {
        return await this.runAtomicPhase(async (manager) => {
            const addressRepo = manager.withRepository(this.addressRepository_);
            await addressRepo.update(id, data);
            return await this.retrieve(id);
        });
    }

    async delete(id: string): Promise<void> {
        return await this.runAtomicPhase(async (manager) => {
            const addressRepo = manager.withRepository(this.addressRepository_);
            await addressRepo.delete(id);
        });
    }
}

export default AddressService;
