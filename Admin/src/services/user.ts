import { Lifetime } from "awilix"
import { FindConfig, UserService as MedusaUserService, Product, Selector } from "@medusajs/medusa"
import { User } from "../models/user"
import { FilterableUserProps, CreateUserInput as MedusaCreateUserInput } from "@medusajs/medusa/dist/types/user"
import StoreRepository from "../repositories/store"
import UserRepository from "../repositories/user"
import { Repository } from "typeorm"
import { FindProductConfig, ProductSelector } from "@medusajs/medusa/dist/types/product"
type CreateUserInput = {
  store_id?: string
} & MedusaCreateUserInput

 
class UserService extends MedusaUserService {
  static LIFE_TIME = Lifetime.SCOPED
  protected readonly loggedInUser_: User | null
  protected readonly storeRepository_: typeof StoreRepository;
  protected readonly userRepository_: Repository<User>;
  static role: string

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    this.storeRepository_ = container.storeRepository
    this.userRepository_ = container.userRepository

    try {
      this.loggedInUser_ = container.loggedInUser
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async create(user: CreateUserInput, password: string): Promise<User> {
    if (!user.store_id) {
      const storeRepo = this.manager_.withRepository(this.storeRepository_)
      let newStore = storeRepo.create()
      newStore = await storeRepo.save(newStore)
      user.store_id = newStore.id
    }

    return await super.create(user, password)
  }

  async  retrieve(userId: string, config?: FindConfig<User>): Promise<User>{
    if (!userId) {
      throw new Error("User ID is required to retrieve a user");
    }
    return await this.userRepository_.findOne({ where: { vendor_id: userId } });
  }

}

export default UserService