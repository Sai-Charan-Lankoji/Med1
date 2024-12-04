import { Lifetime } from "awilix";
import { Vendor } from "../models/vendor";
import { User } from "../models/user";
import { ProductService as MedusaProductService, Product as MedusaProduct } from "@medusajs/medusa";
import { FindProductConfig, CreateProductInput as MedusaCreateProductInput, ProductSelector, UpdateProductInput } from "@medusajs/medusa/dist/types/product";
import { FindManyOptions, IsNull } from "typeorm";

type Product = MedusaProduct & {
  vendor?: Vendor;
  user?: User;
  vendor_id?: string;
};

type CreateProductInput = {
  vendor_id?: string;
} & MedusaCreateProductInput;

class ProductService extends MedusaProductService {
  static LIFE_TIME = Lifetime.SCOPED;
  private readonly productRepository: any;
  private readonly vendorRepository: any;

  constructor(container) {
    super(container);

    try {
      this.productRepository = container.productRepository;
      this.vendorRepository = container.vendorRepository;
    } catch (e) {
      console.error("Error initializing ProductService:", e);
    }
  }

  async create(productObject: any): Promise<Product> {
    if (!productObject.vendor_id) {
      throw new Error("Vendor ID is required to create a product.");
    }

    const newProduct = this.productRepository.create(productObject);
    return await this.productRepository.save(newProduct);
  }

  async update(productId: string, update: UpdateProductInput): Promise<Product> {
    if (!productId) {
      throw new Error("Product ID is required to update a product");
    }

    const existingProduct = await this.productRepository.findOne({ where: { id: productId } });

    if (!existingProduct) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const updatedProduct = this.productRepository.merge(existingProduct, update);
    return await this.productRepository.save(updatedProduct);
  }

  async delete(productId: string): Promise<void> {
    if (!productId) {
      throw new Error("Product ID is required to delete a product");
    }

    const existingProduct = await this.productRepository.findOne({ where: { id: productId } });

    if (!existingProduct) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    await this.productRepository.delete({ id: productId });
  }

  async list(selector: ProductSelector, config?: FindProductConfig): Promise<Product[]> {
    config = config || {};
    return await this.productRepository.find({ where: selector, ...config });
  }

  async listAndCount(selector: ProductSelector, config?: FindProductConfig): Promise<[Product[], number]> {
    config = config || {};
    return await this.productRepository.findAndCount({ where: selector, ...config });
  }

  async retrieve(productId: string, config?: FindProductConfig): Promise<Product> {
    config = config || {};
    const product = await this.productRepository.findOne({ where: { id: productId }, ...config });
    if (!product) {
      throw new Error('Product not found.');
    }
    return product;
  }

  async retrieveByVendorId(vendorId: string | null): Promise<Product[]> {
    const query: any = { where: {} };
    if (vendorId !== null) {
      query.where.vendor_id = vendorId;

      const product = await this.productRepository.find({ where: { vendor_id: vendorId } });
      if (!product) {
        throw new Error(`No Products are found`);
      }
    }

    return this.productRepository.find(query);
  }

  async retrieveByStoreId(storeId: string | null): Promise<Product[]> {
    const query: any = { where: {} };
    if (storeId !== null) {
      query.where.store_id = storeId;

      const product = await this.productRepository.find({ where: { store_id: storeId } });
      if (!product) {
        throw new Error(`No Products are found for this storeId ${storeId}`);
      }
    }

    return this.productRepository.find(query);
  }



  async retrieveByNullVendor(): Promise<Product[]> {
    const query: FindManyOptions<Product> = {
      where: { vendor_id: IsNull() }, 
    };
    return await this.productRepository_.find(query);
  }

}

export default ProductService;