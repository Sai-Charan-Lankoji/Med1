import {
    PublishableApiKey,
    PublishableApiKeySalesChannel,
  } from "@medusajs/medusa";
  
  // Mock Data
  export const mockApiKey = new PublishableApiKey();
  mockApiKey.id = "test-key-id";
  mockApiKey.title = "Test API Key";
  
  export const mockSalesChannel = new PublishableApiKeySalesChannel();
  mockSalesChannel.id = "test-sales-channel-id";
  mockSalesChannel.publishable_key_id = "test-key-id";
  mockSalesChannel.sales_channel_id = "test-sales-channel-id";
  
  // Mock Repositories
  export const mockPublishableApiKeyRepository = {
    create: jest.fn().mockReturnValue(mockApiKey),
    save: jest.fn().mockResolvedValue(mockApiKey),
    findAndCount: jest.fn().mockResolvedValue([[mockApiKey], 1]),
  };
  
  export const mockPublishableApiKeySalesChannelRepository = {
    create: jest.fn().mockReturnValue(mockSalesChannel),
    save: jest.fn().mockResolvedValue(mockSalesChannel),
    find: jest.fn().mockResolvedValue([mockSalesChannel]),
  };
  