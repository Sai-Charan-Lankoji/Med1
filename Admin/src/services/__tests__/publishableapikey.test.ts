import PublishableApiKeyService from "../publishableapikey";
import {
  mockPublishableApiKeyRepository,
  mockPublishableApiKeySalesChannelRepository,
  mockApiKey,
  mockSalesChannel,
} from "../mocks/PublishableApiKeymock"

describe("PublishableApiKeyService", () => {
  let publishableApiKeyService;
  let container;

  beforeEach(() => {
    // Mock container with repositories
    container = {
      publishableapikeyRepository: mockPublishableApiKeyRepository,
      publishableapikeysaleschannelRepository:
        mockPublishableApiKeySalesChannelRepository,
    };

    // Initialize the service
    publishableApiKeyService = new PublishableApiKeyService(container);
  });

  describe("create", () => {
    it("should create and save a new API key with sales channel", async () => {
      const keyData = { title: "New API Key" };
      const result = await publishableApiKeyService.create(
        "test-sales-channel-id",
        keyData
      );

      expect(mockPublishableApiKeyRepository.create).toHaveBeenCalledWith({
        ...keyData,
        title: keyData.title,
      });
      expect(mockPublishableApiKeyRepository.save).toHaveBeenCalledWith(
        mockApiKey
      );
      expect(
        mockPublishableApiKeySalesChannelRepository.create
      ).toHaveBeenCalledWith({
        publishable_key_id: "test-key-id",
        sales_channel_id: "test-sales-channel-id",
      });
      expect(
        mockPublishableApiKeySalesChannelRepository.save
      ).toHaveBeenCalledWith(mockSalesChannel);

      expect(result).toEqual(mockApiKey);
    });

    it("should throw an error if title is missing", async () => {
      const keyData = {}; // No title

      await expect(
        publishableApiKeyService.create("test-sales-channel-id", keyData)
      ).rejects.toThrow("Title is required.");
    });
  });
});
