import { Lifetime } from "awilix";
import { Vendor } from "../models/vendor";
import {
  FindManyOptions,
  IsNull,
} from "typeorm";
import { DesignedProduct } from "../models/designedproducts";

type DesignedProductInput = {
  vendor_id?: string;
  designs?: Record<string, any>;
  designState?: Record<string, any>;
  propsState?: Record<string, any>;
  customizable?: boolean;
  store_id?: string;
};

class DesignedProductService {
  static LIFE_TIME = Lifetime.SCOPED;
  private readonly designedProductRepository: any;

  constructor(container) {
    try {
      this.designedProductRepository = container.designedProductRepository;
    } catch (e) {
      console.error("Error initializing DesignedProductService:", e);
    }
  }

  async create(designedProductObject: DesignedProductInput): Promise<DesignedProduct> {
    if (!designedProductObject.vendor_id) {
      throw new Error("Vendor ID is required to create a designed product.");
    }

    const newDesignedProduct = this.designedProductRepository.create(designedProductObject);
    return await this.designedProductRepository.save(newDesignedProduct);
  }

  async update(designedProductId: string, update: Partial<DesignedProductInput>): Promise<DesignedProduct> {
    if (!designedProductId) {
      throw new Error("Designed Product ID is required to update.");
    }

    const existingDesignedProduct = await this.designedProductRepository.findOne({ where: { id: designedProductId } });

    if (!existingDesignedProduct) {
      throw new Error(`Designed Product with ID ${designedProductId} not found.`);
    }

    const updatedDesignedProduct = this.designedProductRepository.merge(existingDesignedProduct, update);
    return await this.designedProductRepository.save(updatedDesignedProduct);
  }

  async delete(designedProductId: string): Promise<void> {
    if (!designedProductId) {
      throw new Error("Designed Product ID is required to delete.");
    }

    const existingDesignedProduct = await this.designedProductRepository.findOne({ where: { id: designedProductId } });

    if (!existingDesignedProduct) {
      throw new Error(`Designed Product with ID ${designedProductId} not found.`);
    }

    await this.designedProductRepository.delete({ id: designedProductId });
  }

  async list(selector: Partial<DesignedProductInput>, config?: FindManyOptions<DesignedProduct>): Promise<DesignedProduct[]> {
    config = config || {};
    return await this.designedProductRepository.find({ where: selector, ...config });
  }

  async listAndCount(selector: Partial<DesignedProductInput>, config?: FindManyOptions<DesignedProduct>): Promise<[DesignedProduct[], number]> {
    config = config || {};
    return await this.designedProductRepository.findAndCount({ where: selector, ...config });
  }

  async retrieve(designedProductId: string, config?: FindManyOptions<DesignedProduct>): Promise<DesignedProduct> {
    config = config || {};
    const designedProduct = await this.designedProductRepository.findOne({ where: { id: designedProductId }, ...config });
    if (!designedProduct) {
      throw new Error("Designed Product not found.");
    }
    return designedProduct;
  }

  async retrieveByVendorId(vendorId: string): Promise<DesignedProduct[]> {
    const query: any = { where: { vendor_id: vendorId } };

    const designedProduct = await this.designedProductRepository.findOne(query);
    if (!designedProduct) {
      throw new Error(`No Designed Products found for Vendor ID ${vendorId}.`);
    }

    return this.designedProductRepository.find(query);
  }

  async retrieveByNullVendor(): Promise<DesignedProduct[]> {
    const query: FindManyOptions<DesignedProduct> = {
      where: { vendor_id: IsNull() },
    };
    return await this.designedProductRepository.find(query);
  }
}

export default DesignedProductService;
