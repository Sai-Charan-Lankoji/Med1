
export const MockRepository = () => ({
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findAndCount: jest.fn(),
      merge: jest.fn(),
    }
);