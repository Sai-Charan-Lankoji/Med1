import { Lifetime } from "awilix";
import { SalesChannelService as MedusaSalesChannelService, SalesChannel as MedusaSalesChannel } from "@medusajs/medusa";
import { CreateSalesChannelInput as MedusaCreateSalesChannelInput, UpdateSalesChannelInput } from "@medusajs/medusa/dist/types/sales-channels";
import SalesChannelRepository from "@medusajs/medusa/dist/repositories/sales-channel";
import { FindOptionsWhere } from "typeorm";
type SalesChannel = {
  vendor_id?: string;
} & MedusaSalesChannel;

type CreateSalesChannelInput = {
  vendor_id?: string;
} & MedusaCreateSalesChannelInput;

class SalesChannelService extends MedusaSalesChannelService {
  static readonly LIFE_TIME = Lifetime.SCOPED;
  protected readonly salesChannelRepository_: typeof SalesChannelRepository;

  constructor(container) {
    super(container);
    this.salesChannelRepository_ = container.salesChannelRepository;
  }

  async create(salesChannelData: CreateSalesChannelInput): Promise<SalesChannel> {
    if (!salesChannelData.vendor_id) {
      throw new Error("Vendor ID is required to create a Sales Channel.");
    }

    // Make sure this line is creating a sales channel and not a store
    const salesChannel = this.salesChannelRepository_.create(salesChannelData);
    return await this.salesChannelRepository_.save(salesChannel);
  }
  async retrieve(saleschannelId: string): Promise<SalesChannel> {
     
    const salesChannel = await this.salesChannelRepository_.findOne({ where: { id: saleschannelId }});
    if (!salesChannel) {
      throw new Error('Sales Channel not found.');
    }
    return salesChannel;
  }

  async update(saleschannelId: string, update: UpdateSalesChannelInput): Promise<SalesChannel> {
    if (!saleschannelId) {
      throw new Error("Sales Channel ID is required to update a Sales Channel");
    }

    const existingSalesChannel = await this.salesChannelRepository_.findOne({ where: { id: saleschannelId } });

    if (!existingSalesChannel) {
      throw new Error(`SalesChannel with ID ${saleschannelId} not found`);
    }

    const updatedProduct = this.salesChannelRepository_.merge(existingSalesChannel, update);
    return await this.salesChannelRepository_.save(updatedProduct);
  }


  async listSalesChannelsByVendor(vendorId: string | null): Promise<SalesChannel[]> {
    const whereClause: FindOptionsWhere<SalesChannel> = {};

    if (vendorId !== null) {
      whereClause.vendor_id = vendorId; // Set condition based on vendorId

      // Check if any sales channel exists for the vendorId
      const salesChannel = await this.salesChannelRepository_.findOne({
        where: whereClause,
      });

      if (!salesChannel) {
        throw new Error(`No Sales Channels are found for vendor ID: ${vendorId}`);
      }
    }

    // Return sales channels matching the vendorId
    return this.salesChannelRepository_.find({ where: whereClause });
  }
}

export default SalesChannelService;
