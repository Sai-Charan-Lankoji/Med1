import { EntityManager } from 'typeorm';
import { buildQuery, FindConfig, PublishableApiKey, Selector, TransactionBaseService } from '@medusajs/medusa';
import { PublishableApiKeySalesChannel } from '@medusajs/medusa';
import { Vendor } from '../models/vendor';

class PublishableApiKeyService extends TransactionBaseService {
  private readonly publishableapikeyRepository: any;
  private readonly publishableapikeysaleschannelRepository: any;

  public runAtomicPhase<T>(
    callback: (manager: EntityManager) => Promise<T>
  ): Promise<T> {
    return this.atomicPhase_(callback);
  }

  constructor(container) {
    super(container);
    try {
      this.publishableapikeyRepository = container.publishableapikeyRepository;
      this.publishableapikeysaleschannelRepository = container.publishableapikeysaleschannelRepository;
    } catch (e) {
      console.error("Error initializing PublishableApiKeyService:", e);
    }
  }

  async listAndCount(
    selector?: Selector<PublishableApiKey>,
    config: FindConfig<PublishableApiKey> = { skip: 0, take: 20, relations: [] }
  ): Promise<[PublishableApiKey[], number]> {
    return await this.runAtomicPhase(async (manager) => {
      const publishableapikeyRepo = manager.withRepository(this.publishableapikeyRepository);
      const query = buildQuery(selector, config);
      return await publishableapikeyRepo.findAndCount(query);
    });
  }

  async list(
    selector?: Selector<PublishableApiKey>,
    config: FindConfig<PublishableApiKey> = { skip: 0, take: 20, relations: [] }
  ): Promise<PublishableApiKey[]> {
    const [publishableapikeys] = await this.listAndCount(selector, config);
    return publishableapikeys;
  }

  async getAllKeys(): Promise<[PublishableApiKey[], number]> {
    return await this.runAtomicPhase(async (manager) => {
      const publishableapikeyRepo = manager.withRepository(this.publishableapikeyRepository);
      return await publishableapikeyRepo.findAndCount();
    });
  }

  async getSalesChannelKeys(salesChannelId: string): Promise<PublishableApiKeySalesChannel[]> {
    return await this.runAtomicPhase(async (manager) => {
      const publishableapikeysaleschannelRepo = manager.withRepository(this.publishableapikeysaleschannelRepository);
      return await publishableapikeysaleschannelRepo.find({ where: { sales_channel_id: salesChannelId } });
    });
  }

  async create(
    salesChannelId: string,
    keyData: Partial<PublishableApiKey>
  ): Promise<PublishableApiKey> {
    if (!keyData.title) {
      throw new Error("Title is required.");
    }

    const newApiKey = this.publishableapikeyRepository.create({
      ...keyData,
      title: keyData.title,
    });

    const savedApiKey = await this.publishableapikeyRepository.save(newApiKey);

    const publishableApiKeySalesChannel = this.publishableapikeysaleschannelRepository.create({
      publishable_key_id: savedApiKey.id,
      sales_channel_id: salesChannelId,
    });

    await this.publishableapikeysaleschannelRepository.save(publishableApiKeySalesChannel);

    return savedApiKey;
  }
}

export default PublishableApiKeyService;