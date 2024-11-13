import VendorService from "../vendor";
import { MockRepository } from "../mocks/vendormock";
import { BusinessModel, Vendor } from "../../models/vendor";
import { MedusaError } from '@medusajs/utils';

class TestableVendorService extends VendorService {
  public get vendorRepository() {
    return this.vendorRepository_;
  }

  // public get userRepository() {
  //   return this.userRepository_;
  // }

  public get addressRepository() {
    return this.addressRepository_;
  }
}

const mockVendorRepository = MockRepository();
const mockUserRepository = MockRepository();
const mockAddressRepository = MockRepository();
mockUserRepository.create = jest.fn();
mockAddressRepository.create = jest.fn();

let vendorService = new TestableVendorService({
  vendorRepository: mockVendorRepository,
  userRepository: mockUserRepository,
  addressRepository: mockAddressRepository,
});

vendorService.runAtomicPhase = jest.fn((callback) => {
  const mockManager = {
    withRepository: jest.fn((repo) => {
      if (repo === vendorService.vendorRepository) {
        return mockVendorRepository;
      } else if (repo === vendorService.addressRepository) {
        return mockAddressRepository;
      }
      throw new Error("Unknown repository");
    }),
  };
  return callback(mockManager as any);
});

describe("VendorService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new vendor, associated user, and address with correct vendor_id", async () => {
      const vendorData = {
        id: "55436",
        company_name: "Test Company",
        contact_name: "John Doe",
        registered_number: "123456",
        contact_email: "mailto:john@example.com",
        contact_phone_number: "555-1234",
        tax_number: "TAX123",
        user_id: undefined,
        business_type: BusinessModel.ApparelDesign,
        password: "praveen@1234",
        vendorAddressData: {
          first_name: "John",
          last_name: "Doe",
          address_1: "123 Vendor St",
          address_2: "Apt 101",
          city: "Vendor City",
          province: "Vendor Province",
          postal_code: "V12345",
          phone: "555-1234"
        },
        registrationAddressData: {
          address_1: "456 Registration Ave",
          address_2: "Suite 202",
          city: "Registration City",
          province: "Registration Province",
          postal_code: "R67890",
          phone: "555-5678"
        },
        userData: {
          first_name: "johndoe",
          last_name: "johndoe",
          password: "johndoe@123"
        }
      };
  
      const mockVendor = { ...vendorData, id: "vendor-id" };
      const mockUser = { id: "user-id", email: vendorData.contact_email };
      const mockAddress = {
        company: vendorData.company_name,
        first_name: vendorData.vendorAddressData.first_name,
        last_name: vendorData.vendorAddressData.last_name,
        address_1: "123 Vendor St - 456 Registration Ave",
        address_2: "Apt 101 - Suite 202",
        city: "Vendor City - Registration City",
        province: "Vendor Province - Registration Province",
        postal_code: "V12345 - R67890",
        phone: "555-1234 - 555-5678",
        vendor_address_id: "vendor-id",
        registration_address_id: "vendor-id"
      };
  
      mockVendorRepository.createVendor.mockResolvedValue(mockVendor);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockAddressRepository.create.mockReturnValue(mockAddress);
      mockAddressRepository.save.mockResolvedValue(mockAddress);
  
      const result = await vendorService.create(vendorData);
  
      // Assert vendor creation
      expect(mockVendorRepository.createVendor).toHaveBeenCalledWith(
        expect.objectContaining({
          company_name: vendorData.company_name,
          contact_name: vendorData.contact_name,
          contact_email: vendorData.contact_email
        })
      );
  
      // Assert user creation
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: vendorData.contact_email,
        first_name: vendorData.userData.first_name,
        last_name: vendorData.userData.last_name,
        password: expect.any(String), // hashed password
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
  
      // Assert address creation with concatenated values
      expect(mockAddressRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(mockAddress)
      );
      expect(mockAddressRepository.save).toHaveBeenCalledWith(mockAddress);
  
      // Assert final result
      expect(result).toEqual(mockVendor);
    });
  });
  
  


  describe("update", () => {
    it("should throw an error if the vendor does not exist", async () => {
      const vendorId = "nonexistent-id";
      const vendorData = {
        company_name: "Nonexistent Company",
        contact_name: "Nonexistent Contact",
        contact_email: "mailto:nonexistent@example.com",
      };
  
      mockVendorRepository.getVendor.mockResolvedValue(null);
  
      await expect(vendorService.update(vendorId, vendorData)).rejects.toThrow(
        "Vendor with id nonexistent-id was not found."
      );
  
      expect(mockVendorRepository.getVendor).toHaveBeenCalledWith(vendorId);
      expect(mockVendorRepository.updateVendor).not.toHaveBeenCalled();
    });
  
    it("should update an existing vendor", async () => {
      const vendorId = "vendor-id";
      const vendorData = {
        company_name: "Updated Company",
        contact_name: "Updated Contact",
        contact_email: "mailto:updated@example.com",
        vendorAddressData: {
          address_1: "Updated Address 1",
        },
        registrationAddressData: {
          address_1: "Registration Address 1",
        },
        userData: {
          email: "mailto:updated-user@example.com",
        },
      };
  
      const mockVendor = { id: vendorId, ...vendorData };
      const mockAddress = { id: "address-id", vendor_address_id: vendorId, address_1: "Old Address 1" };
      const mockUser = { id: "user-id", vendor_id: vendorId, email: "mailto:old@example.com" };
  
      mockVendorRepository.getVendor.mockResolvedValue(mockVendor);
      mockVendorRepository.updateVendor.mockResolvedValue(mockVendor);
      mockAddressRepository.findOne.mockResolvedValue(mockAddress);
      mockUserRepository.findOne.mockResolvedValue(mockUser);
  
      const result = await vendorService.update(vendorId, vendorData);
  
      expect(mockVendorRepository.getVendor).toHaveBeenCalledWith(vendorId);
      expect(mockVendorRepository.updateVendor).toHaveBeenCalledWith(vendorId, expect.objectContaining(vendorData));
      expect(result).toEqual(mockVendor);
    });
  });
  


  describe("delete", () => {
    it("should delete an existing vendor, its associated user, and address", async () => {
      const vendorId = "vendor-id";
  
      const mockVendor = {
        id: vendorId,
        user_id: "user-id",
      };
  
      mockVendorRepository.findOne.mockResolvedValue(mockVendor);
      mockUserRepository.delete.mockResolvedValue(undefined);
      mockAddressRepository.delete.mockResolvedValue(undefined);
      mockVendorRepository.deleteVendor.mockResolvedValue(undefined);
  
      await vendorService.delete(vendorId);
  
      expect(mockVendorRepository.findOne).toHaveBeenCalledWith({ where: { id: vendorId } });
      expect(mockUserRepository.delete).toHaveBeenCalledWith({ id: mockVendor.user_id }); // Updated this line
      expect(mockAddressRepository.delete).toHaveBeenCalledWith({ vendor_address_id: vendorId }); // Also ensure this line matches your service logic
      expect(mockVendorRepository.deleteVendor).toHaveBeenCalledWith(vendorId);
    });
  
    it("should throw an error if the vendor does not exist", async () => {
      const vendorId = "nonexistent-id";
  
      mockVendorRepository.findOne.mockResolvedValue(null);
  
      await expect(vendorService.delete(vendorId)).rejects.toThrow(
        new MedusaError(MedusaError.Types.NOT_FOUND, `Vendor with id ${vendorId} not found.`)
      );
    });
  });
  


  describe("retrieve", () => {
    it("should throw an error if the vendor is not found", async () => {
      const vendorId = "non_existent_vendor";
      mockVendorRepository.findOne.mockResolvedValue(null);

      await expect(vendorService.retrieve(vendorId)).rejects.toThrow(`Vendor with id ${vendorId} was not found.`);
    });

  });


  describe("getAllVendors", () => {
    it("should return a list of vendors and the total count", async () => {
      const mockVendors = [
        { id: "vendor1", company_name: "Company One" },
        { id: "vendor2", company_name: "Company Two" },
        { id: "vendor3", company_name: "Company Three" },
      ];
      const totalVendors = 3;

      mockVendorRepository.getVendors.mockResolvedValue([mockVendors, totalVendors]);

      const [result, count] = await vendorService.getAllVendors();

      expect(vendorService.runAtomicPhase).toHaveBeenCalled();
      expect(mockVendorRepository.getVendors).toHaveBeenCalledWith();
      expect(result).toEqual(mockVendors);
      expect(count).toEqual(totalVendors);
    });

    it("should handle an empty vendor list", async () => {
      const mockVendors = [];
      const totalVendors = 0;

      mockVendorRepository.getVendors.mockResolvedValue([mockVendors, totalVendors]);

      const [result, count] = await vendorService.getAllVendors();

      expect(vendorService.runAtomicPhase).toHaveBeenCalled();
      expect(mockVendorRepository.getVendors).toHaveBeenCalledWith();
      expect(result).toEqual(mockVendors);
      expect(count).toEqual(totalVendors);
    });
  });

  describe("find", () => {
    it("should return a vendor that matches the selector", async () => {
      const selector = { company_name: "Test Company" };
      const mockVendor = {
        id: "vendor-id",
        company_name: "Test Company",
        contact_name: "John Doe",
      };

      mockVendorRepository.findVendor.mockResolvedValue(mockVendor);

      const result = await vendorService.find(selector);

      expect(vendorService.runAtomicPhase).toHaveBeenCalled();
      expect(mockVendorRepository.findVendor).toHaveBeenCalledWith(selector);
      expect(result).toEqual(mockVendor);
    });

    it("should return undefined if no vendor matches the selector", async () => {
      const selector = { company_name: "Nonexistent Company" };

      mockVendorRepository.findVendor.mockResolvedValue(undefined);

      const result = await vendorService.find(selector);

      expect(vendorService.runAtomicPhase).toHaveBeenCalled();
      expect(mockVendorRepository.findVendor).toHaveBeenCalledWith(selector);
      expect(result).toBeUndefined();
    });
  });

  describe("listAndCount", () => {
    it("should return paginated vendors and total count", async () => {
      const selector = {};
      const config = { skip: 0, take: 2, relations: [] };
      const mockVendors = [
        { id: "vendor1", company_name: "Company One" },
        { id: "vendor2", company_name: "Company Two" },
      ];
      const totalVendors = 5;

      mockVendorRepository.findAndCount.mockResolvedValue([mockVendors, totalVendors]);

      const [result, count] = await vendorService.listAndCount(selector, config);

      expect(vendorService.runAtomicPhase).toHaveBeenCalled();
      expect(mockVendorRepository.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
        skip: config.skip,
        take: config.take,
      }));
      expect(result).toEqual(mockVendors);
      expect(count).toEqual(totalVendors);
    });
  });
});
