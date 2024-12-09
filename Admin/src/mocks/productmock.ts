// mocks/product-repository.js
const productRepositoryMock = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
  merge: jest.fn(),
};

const vendorRepositoryMock = {
  findOne: jest.fn(),
};

module.exports = {
  productRepositoryMock,
  vendorRepositoryMock,
};
