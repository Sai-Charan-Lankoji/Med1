import { EntityManager, ILike, IsNull } from 'typeorm';
import { buildQuery, FindConfig, PublishableApiKey, Selector, TransactionBaseService } from '@medusajs/medusa';
import { PublishableApiKeySalesChannel } from '@medusajs/medusa';
import { Vendor } from '../models/vendor';
import { notNull } from 'jest-mock-extended';

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
   
  
  retrieve(publishableApiKeyId: string, config?: FindConfig<PublishableApiKey>): Promise<PublishableApiKey | never>{
  return this.runAtomicPhase(async (manager) => {
      const publishableapikeyRepo = manager.withRepository(this.publishableapikeyRepository);
      const apiKey = await this.publishableapikeysaleschannelRepository.findOne({ where: { sales_channel_id: publishableApiKeyId }});
      if (!apiKey) {
        throw new Error("Publishable API not found");
      }
      return apiKey;
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
    return this.atomicPhase_(async (transactionManager: EntityManager) => {
      if (!keyData.title) {
        throw new Error("Title is required.");
      }

      const publishableapikeyRepo = transactionManager.withRepository(this.publishableapikeyRepository);
      const publishableapikeysaleschannelRepo = transactionManager.withRepository(this.publishableapikeysaleschannelRepository);

      const newApiKey = publishableapikeyRepo.create(keyData);
      const savedApiKey = await publishableapikeyRepo.save(newApiKey);

      const publishableApiKeySalesChannel = publishableapikeysaleschannelRepo.create({
        publishable_key_id: savedApiKey.id,
        sales_channel_id: salesChannelId,
      });

      const newpublishableapikeysaleschannel = await publishableapikeysaleschannelRepo.save(publishableApiKeySalesChannel);
      console.log("NEWPUBLISHABLEAPIKEYSALESCHANNEL ", newpublishableapikeysaleschannel)
      return savedApiKey;
    });
  }

  async delete(publishableApiKeyId: string): Promise<void>{
    return this.runAtomicPhase(async (manager) => {
      const apiKey = await this.publishableapikeyRepository.findOne({ where: { id: publishableApiKeyId }});
      if (!apiKey) {
        throw new Error("Publishable API not found");
      }
      await this.publishableapikeyRepository.delete(apiKey);
    });
  }


}

export default PublishableApiKeyService;