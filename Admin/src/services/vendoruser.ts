import { EntityManager, Repository } from "typeorm";
import { VendorUser } from "../models/vendor-user";
import { MedusaError } from "@medusajs/utils";
import { TransactionBaseService } from "@medusajs/medusa";
import bcrypt from "bcryptjs";
import { FindConfig } from "@medusajs/medusa/dist/types/common";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

type CreateVendorUserInput = {
  email: string;
  password: string;
  first_name?: string;
  last_name: string;
  role: string;
  vendor_id?: string;
};

class VendorUserService extends TransactionBaseService {
  protected readonly manager_: EntityManager;
  protected readonly vendorUserRepository_: Repository<VendorUser>;

  constructor(container) {
    super(container);

    this.manager_ = container.manager;
    this.vendorUserRepository_ = container.manager.getRepository(VendorUser);
  }

  /**
   * Creates a new vendor user
   * @param data - The vendor user data
   * @returns Promise<VendorUser>
   */
  async create(data: CreateVendorUserInput): Promise<VendorUser> {
    return await this.atomicPhase_(async (transactionManager) => {
      const vendorUserRepo = transactionManager.getRepository(VendorUser);

      // Validate required fields
      if (!data.email) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Email is required"
        );
      }

      if (!data.password) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Password is required"
        );
      }

      if (!data.role) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Role is required"
        );
      }

      // Check if email already exists
      const existing = await vendorUserRepo.findOne({
        where: { email: data.email },
      });

      if (existing) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          "A user with this email already exists"
        );
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const toCreate = {
        ...data,
        password: hashedPassword,
      };

      const vendorUser = vendorUserRepo.create(toCreate);

      // Ensure ID is generated
      vendorUser.id = generateEntityId(vendorUser.id, "vuser");

      const created = await vendorUserRepo.save(vendorUser);
      return created;
    });
  }

  async retrieve(id: string) {
    return await this.atomicPhase_(async (transactionManager) => {
      const vendorUserRepo = transactionManager.getRepository(VendorUser);
      const users = await vendorUserRepo.find({
        where: { vendor_id: id },
      });

      if (!users) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `User with id ${id} was not found.`
        );
      }
      return users;
    });
  }

  async findByEmail(email: string): Promise<VendorUser | null> {
    return await this.atomicPhase_(async (transactionManager) => {
      const vendorUserRepo = transactionManager.getRepository(VendorUser);
      const vendor = await vendorUserRepo.findOne({ where: { email: email } });
      return vendor || null;
    });
  }
}
export default VendorUserService;
