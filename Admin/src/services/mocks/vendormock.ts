
export const MockRepository = () => ({
  createVendor: jest.fn(),
  updateVendor: jest.fn(),
  deleteVendor: jest.fn(),
  findOne: jest.fn(),
  getVendor: jest.fn(),
  getVendors: jest.fn(),
  findVendor: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});



