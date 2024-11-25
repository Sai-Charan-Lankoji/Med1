import {
  FindConfig,
  Selector,
  TransactionBaseService,
  buildQuery,
} from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import VendorRepository from "../repositories/vendor";
import { BusinessModel, Vendor } from "../models/vendor";
import { MedusaError } from "@medusajs/utils";
import VendorUserRepository from "../repositories/vendor-user";
import AddressRepository from "../repositories/address";
import { Address } from "../models/address";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import { compact, first, last } from "lodash";
import { VendorUser } from "../models/vendor-user";

class VendorService extends TransactionBaseService {
  protected manager_: EntityManager;
  protected vendorRepository_: typeof VendorRepository;
  // protected vendoruserRepository_: typeof VendorUserRepository;
  protected addressRepository_: typeof AddressRepository;

  public runAtomicPhase<T>(
    callback: (manager: EntityManager) => Promise<T>
  ): Promise<T> {
    return this.atomicPhase_(callback);
  }

  constructor(container) {
    super(container);
    this.manager_ = container.manager;
    this.vendorRepository_ = container.vendorRepository;
    // this.vendoruserRepository_ = container.vendoruserRepository;
    this.addressRepository_ = container.addressRepository;
  }

  async listAndCount(
    selector?: Selector<Vendor>,
    config: FindConfig<Vendor> = { skip: 0, take: 20, relations: [] }
  ): Promise<[Vendor[], number]> {
    return await this.runAtomicPhase(async (manager) => {
      const vendorRepo = manager.withRepository(this.vendorRepository_);
      const query = buildQuery(selector, config);
      return await vendorRepo.findAndCount(query);
    });
  }

  async list(
    selector?: Selector<Vendor>,
    config: FindConfig<Vendor> = { skip: 0, take: 20, relations: [] }
  ): Promise<Vendor[]> {
    const [vendors] = await this.listAndCount(selector, config);
    return vendors;
  }

  async getAllVendors(): Promise<[Vendor[], number]> {
    return await this.runAtomicPhase(async (manager) => {
      const vendorRepo = manager.withRepository(this.vendorRepository_);
      return await vendorRepo.getVendors();
    });
  }

  async retrieve(
    id: string
  ): Promise<{
    vendor: Vendor;
    user: User;
    vendorAddress: Address;
    registrationAddress: Address;
  }> {
    return await this.runAtomicPhase(async (manager) => {
      const vendorRepo = manager.withRepository(this.vendorRepository_);
      const vendor = await vendorRepo.findOne({
        where: { id },
      });

      if (!vendor) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Vendor with id ${id} was not found.`
        );
      }

      const userRepo = manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { id: vendor.user_id },
      });

      if (!user) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `User associated with vendor id ${id} was not found.`
        );
      }
      const addressRepo = manager.withRepository(this.addressRepository_);
      const vendorAddress = await addressRepo.findOne({
        where: { vendor_address_id: vendor.id },
      });

      const registrationAddress = await addressRepo.findOne({
        where: { registration_address_id: vendor.id },
      });
      // if (address.vendor_address_id) {
      //   address = await addressRepo.findOne({
      //     where: { id: address.vendor_address_id },
      //   });
      // }

      // Return the vendor, user, and optionally the address
      return { vendor, user, vendorAddress, registrationAddress };
    });
  }

  async find(selector: Partial<Vendor>): Promise<Vendor | undefined> {
    return await this.runAtomicPhase(async (manager) => {
      const vendorRepo = manager.withRepository(this.vendorRepository_);
      return await vendorRepo.findVendor(selector);
    });
  }

  async create(
    data: Pick<
      Vendor,
      | "company_name"
      | "contact_name"
      | "registered_number"
      | "contact_email"
      | "contact_phone_number"
      | "tax_number"
      | "user_id"
      | "business_type"
      | "password"
      | "plan"
    > & {
      vendorAddressData?: Partial<Address>;
      registrationAddressData?: Partial<Address>;
      // userData?: Partial<VendorUser>;
    }
  ): Promise<Vendor> {
    return await this.runAtomicPhase(async (manager) => {
      const vendorRepo = manager.withRepository(this.vendorRepository_);
      const addressRepo = manager.withRepository(this.addressRepository_);

      // Hash the password and create Vendor
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
      const vendor = await vendorRepo.createVendor(data);

      const vendorAddress1 = data.vendorAddressData.address_1 || "";
      const registrationAddress1 = data.registrationAddressData.address_1 || "";
      const combinedAddress1 = `${vendorAddress1} - ${registrationAddress1}`;

      const vendorAddress2 = data.vendorAddressData.address_2 || "";
      const registrationAddress2 = data.registrationAddressData.address_2 || "";
      const combinedAddress2 = `${vendorAddress2} - ${registrationAddress2}`;

      const vendorCity = data.vendorAddressData?.city || "";
      const registrationCity = data.registrationAddressData?.city || "";
      const combinedCity = `${vendorCity} - ${registrationCity}`;

      const vendorProvince = data.vendorAddressData?.province || "";
      const registrationProvince = data.registrationAddressData?.province || "";
      const combinedProvince = `${vendorProvince} - ${registrationProvince}`;

      const vendorPostalCode = data.vendorAddressData?.postal_code || "";
      const registrationPostalCode =
        data.registrationAddressData?.postal_code || "";
      const combinedPostalCode = `${vendorPostalCode} - ${registrationPostalCode}`;

      const vendorPhone = data.vendorAddressData?.phone || "";
      const registrationPhone = data.registrationAddressData?.phone || "";
      const combinedPhone = `${vendorPhone} - ${registrationPhone}`;

      // Create Address with concatenated values
      if (data.vendorAddressData || data.registrationAddressData) {
        const address = addressRepo.create({
          company: data.company_name,
          first_name: data.vendorAddressData.first_name,
          last_name: data.vendorAddressData.last_name,
          address_1: combinedAddress1,
          address_2: combinedAddress2,
          city: combinedCity,
          province: combinedProvince,
          postal_code: combinedPostalCode,
          phone: combinedPhone,
          vendor_address_id: vendor.id,
          registration_address_id: vendor.id,
        });
        await addressRepo.save(address);
      }

      return vendor;
    });
  }

  async findByEmail(email: string): Promise<Vendor | null> {
    const vendor = await this.vendorRepository_.findOne({
      where: { contact_email: email },
    });
    return vendor || null;
  }

  async findByBussinessType(bussinessType: string): Promise<Vendor | null> {
    const vendor = await this.vendorRepository_.findOne({
      where: { business_type: BusinessModel.ApparelDesign },
    });
    return vendor || null;
  }

  async update(
    id: string,
    data: Partial<Vendor> & {
      vendorAddressData?: Partial<Address>;
      registrationAddressData?: Partial<Address>;
      userData?: Partial<User>;
    }
  ): Promise<Vendor> {
    return await this.runAtomicPhase(async (manager) => {
      const vendorRepo = manager.withRepository(this.vendorRepository_);
      // const userRepo = manager.withRepository(this.userRepository_);
      const addressRepo = manager.withRepository(this.addressRepository_);

      let vendor = await vendorRepo.getVendor(id);

      if (!vendor) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Vendor with id ${id} was not found.`
        );
      }

      vendor = await vendorRepo.updateVendor(id, data);

      // Update user data if provided
      // if (vendor.user_id) {
      //   const user = await userRepo.findOne({ where: { id: vendor.user_id } });

      //   if (!user) {
      //     throw new MedusaError(
      //       MedusaError.Types.NOT_FOUND,
      //       `User with id ${vendor.user_id} not found.`
      //     );
      //   }

      //   Object.assign(user, { ...data.userData, email: vendor.contact_email });
      //   await userRepo.save(user);
      // }

      // Update address data if provided
      if (vendor.id) {
        const address = await addressRepo.findOne({
          where: {
            vendor_address_id: vendor.id,
            registration_address_id: vendor.id,
          },
        });

        if (!address) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Address with vendor_address_id ${vendor.id} not found.`
          );
        }

        const vendorAddress1 = data.vendorAddressData.address_1 || "";
        const registrationAddress1 =
          data.registrationAddressData.address_1 || "";
        const combinedAddress1 = `${vendorAddress1} - ${registrationAddress1}`;

        const vendorAddress2 = data.vendorAddressData.address_2 || "";
        const registrationAddress2 =
          data.registrationAddressData.address_2 || "";
        const combinedAddress2 = `${vendorAddress2} - ${registrationAddress2}`;

        const vendorCity = data.vendorAddressData?.city || "";
        const registrationCity = data.registrationAddressData?.city || "";
        const combinedCity = `${vendorCity} - ${registrationCity}`;

        const vendorProvince = data.vendorAddressData?.province || "";
        const registrationProvince =
          data.registrationAddressData?.province || "";
        const combinedProvince = `${vendorProvince} - ${registrationProvince}`;

        const vendorPostalCode = data.vendorAddressData?.postal_code || "";
        const registrationPostalCode =
          data.registrationAddressData?.postal_code || "";
        const combinedPostalCode = `${vendorPostalCode} - ${registrationPostalCode}`;

        const vendorPhone = data.vendorAddressData?.phone || "";
        const registrationPhone = data.registrationAddressData?.phone || "";
        const combinedPhone = `${vendorPhone} - ${registrationPhone}`;

        Object.assign(address, {
          company: vendor.company_name,
          first_name: data.vendorAddressData.first_name,
          last_name: data.vendorAddressData.last_name,
          address_1: combinedAddress1,
          address_2: combinedAddress2,
          city: combinedCity,
          province: combinedProvince,
          postal_code: combinedPostalCode,
          phone: combinedPhone,
          vendor_address_id: vendor.id,
          registration_address_id: vendor.id,
        });

        await addressRepo.save(address);
      }

      // Retrieve the updated vendor information
      vendor = await vendorRepo.getVendor(id);
      return vendor;
    });
  }

  async delete(id: string): Promise<void> {
    return await this.runAtomicPhase(async (manager) => {
      const vendorRepo = manager.withRepository(this.vendorRepository_);
      // const userRepo = manager.withRepository(this.userRepository_);
      const addressRepo = manager.withRepository(this.addressRepository_);

      const vendor = await vendorRepo.findOne({ where: { id } });

      if (!vendor) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Vendor with id ${id} not found.`
        );
      }

      // Delete associated user
      // if (vendor.user_id) {
      //   await userRepo.delete({ id: vendor.user_id });
      // }

      // Delete associated address
      if (vendor.id) {
        await addressRepo.delete({ vendor_address_id: vendor.id });
      }

      // Delete vendor
      await vendorRepo.deleteVendor(id);
    });
  }
}

export default VendorService;
