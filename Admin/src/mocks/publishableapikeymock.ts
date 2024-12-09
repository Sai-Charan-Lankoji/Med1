const mockPublishableApiKeyRepository = {
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockPublishableApiKeySalesChannelRepository = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

export { mockPublishableApiKeyRepository, mockPublishableApiKeySalesChannelRepository };
