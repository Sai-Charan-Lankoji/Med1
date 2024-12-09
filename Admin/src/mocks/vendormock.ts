const mockVendorRepository = {
  findAndCount: jest.fn(),
  findVendor: jest.fn(),
  getVendor: jest.fn(),
  createVendor: jest.fn(),
  updateVendor: jest.fn(),
  deleteVendor: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  getVendors: jest.fn(),
};

export default mockVendorRepository;
