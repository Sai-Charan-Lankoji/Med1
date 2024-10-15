import { Lifetime } from "awilix";
import { StoreService as MedusaStoreService, Store as MedusaStore } from "@medusajs/medusa";
import StoreRepository from "@medusajs/medusa/dist/repositories/store";
import { DeepPartial, FindOptionsWhere } from "typeorm";
import { UpdateStoreInput } from "@medusajs/medusa/dist/types/store";

 type Store = MedusaStore & {
  vendor_id?: string;
  default_sales_channel_id?: string;
};

interface StoreData {
  vendor_id: string;
  default_sales_channel_id: string; 
  name: string; 
}

class StoreService extends MedusaStoreService {
  static readonly LIFE_TIME = Lifetime.SCOPED;
  protected readonly storeRepository_: typeof StoreRepository;

  constructor(container) {
    super(container);
    this.storeRepository_ = container.storeRepository;
  }

  async createStore(storeData: StoreData): Promise<Store> {
    if (!storeData.vendor_id) {
      throw new Error("Vendor ID is required to create a store.");
    }
    if (!storeData.default_sales_channel_id) {
      throw new Error("Default sales channel ID is required to create a store.");
    }

    const store = this.storeRepository_.create(storeData);
    return await this.storeRepository_.save(store);
  }

  async retrieveByStoreId(storeId: string): Promise<Store> {
     
    const store = await this.storeRepository_.findOne({ where: { id: storeId }});
    if (!store) {
      throw new Error('Sales Channel not found.');
    }
    return store;
  }

  async updateStore(storeId: string, updateData: DeepPartial<Store>): Promise<Store> {
    if (!storeId) {
      throw new Error("Store ID is required to update a Sales Channel");
    }
  
    const existingStore = await this.storeRepository_.findOne({ where: { id: storeId } });
  
    if (!existingStore) {
      throw new Error(`Store with ID ${storeId} not found`);
    }
  
    const updatedStore = this.storeRepository_.merge(existingStore, updateData);
    return await this.storeRepository_.save(updatedStore);
  }

  async delete(storeId: string): Promise<void> {
    if (!storeId) {
      throw new Error("Store ID is required to delete a product");
    }

    const existingStore = await this.storeRepository_.findOne({ where: { id: storeId } });

    if (!existingStore) {
      throw new Error(`Store with ID ${storeId} not found`);
    }

    await this.storeRepository_.delete({ id: storeId });
  }

  async listStoresByVendor(vendorId: string | null): Promise<Store[]> {
    const whereClause: FindOptionsWhere<Store> = {};

  if (vendorId !== null) {
    whereClause.vendor_id = vendorId; // Set condition based on vendorId

    // Check if any store exists for the vendorId
    const store = await this.storeRepository_.findOne({
      where: whereClause,
    });
    
    if (!store) {
      throw new Error(`No Stores are found for vendor ID: ${vendorId}`);
    }
  }

  // Return stores matching the vendorId
  return this.storeRepository_.find({ where: whereClause });
  }
}

export default StoreService;
