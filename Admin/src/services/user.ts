import { Lifetime } from "awilix";
import {
  FindConfig,
  UserService as MedusaUserService,
  Product,
  Selector,
} from "@medusajs/medusa";
import {
  FilterableUserProps,
  CreateUserInput as MedusaCreateUserInput,
} from "@medusajs/medusa/dist/types/user";
import StoreRepository from "../repositories/store";
import UserRepository from "../repositories/user";
import { Repository } from "typeorm";
import {
  FindProductConfig,
  ProductSelector,
} from "@medusajs/medusa/dist/types/product";
import { User } from "../models/user";
type CreateUserInput = {
  store_id?: string;
  vendor_id?: string;
} & MedusaCreateUserInput;

class UserService extends MedusaUserService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly loggedInUser_: User | null;
  protected readonly storeRepository_: typeof StoreRepository;
  protected readonly userRepository_: Repository<User>;
  static role: string;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.storeRepository_ = container.storeRepository;
    this.userRepository_ = container.userRepository;

    try {
      this.loggedInUser_ = container.loggedInUser;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async create(userData: CreateUserInput, password: string): Promise<User> {
    try {
      // Validate required fields
      if (!userData.email || !password || !userData.vendor_id) {
        throw new Error(
          "Missing required fields: email, password, or vendor_id"
        );
      }
      const hashedPassword = await this.hashPassword_(password);

      // Create user object with required fields
      const userToCreate = {
        email: userData.email,
        password: hashedPassword,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        role: userData.role || "member",
        vendor_id: userData.vendor_id,
        store_id: userData.store_id,
      };

      // If store_id is not provided, create a new store
      if (!userToCreate.store_id) {
        const storeRepo = this.manager_.withRepository(this.storeRepository_);
        const newStore = storeRepo.create({
          vendor_id: userToCreate.vendor_id, // Associate store with vendor
        });
        const savedStore = await storeRepo.save(newStore);
        userToCreate.store_id = savedStore.id;
      }

      // Create and save the user
      const userRepo = this.manager_.withRepository(this.userRepository_);
      const user = await userRepo.create({
        email: userData.email,
        password_hash: hashedPassword,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        role: userData.role,
        vendor_id: userData.vendor_id,
        store_id: userData.store_id,
      });
      return await userRepo.save(user);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async retrieveByVendor(vendorId: string, config?: FindConfig<User>): Promise<User[]> {
    if (!vendorId) {
      throw new Error("vendor ID is required to retrieve a user");
    }
    return await this.userRepository_.find({ where: { vendor_id: vendorId } });
  }

  async retrieve(userId: string, config?: FindConfig<User>): Promise<User>{
    if(!userId){
      throw new Error("User ID is required to retrieve a User")
    }
    return await this.userRepository_.findOne( {where: { id: userId }})
  }

  async retrieveByEmail(email: any, config?: FindConfig<User>): Promise<User>{
    const user = await this.userRepository_.findOne({ where: { email: email } });
    return user || null;
  }
}

export default UserService;
