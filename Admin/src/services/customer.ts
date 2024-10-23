import { Lifetime } from "awilix";
import {
    TransactionBaseService,
    Customer as MedusaCustomer,
    FindConfig
} from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { CreateCustomerInput as MedusaCreateCustomerInput, UpdateCustomerInput } from "@medusajs/medusa/dist/types/customers";

type Customer = MedusaCustomer & {
    vendor_id?: string;
    
};

type CreateCustomerInput = {
    vendor_id?: string; 
} & MedusaCreateCustomerInput;

class CustomerService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected manager_: EntityManager;
    private readonly customerRepository: any;

    public runAtomicPhase<T>(callback: (manager: EntityManager) => Promise<T>): Promise<T> {
        return this.atomicPhase_(callback);
    }

    constructor(container) {
        super(container);

        try {
            this.customerRepository = container.customerRepository;
        } catch (e) {
            console.error("Error initializing CustomerService:", e);
        }
    }

    async create(customerObject: CreateCustomerInput): Promise<Customer> {
        // Check if the customer already exists
        const existingCustomer = await this.checkCustomerExists(customerObject);

        if (existingCustomer) {
            throw new Error(`Customer with the given details already exists.`);
        }

        // Create a new customer with the provided data
        const newCustomer = this.customerRepository.create({
            email: customerObject.email,
            password_hash: customerObject.password_hash, // Ensure password is hashed before passing
            first_name: customerObject.first_name,
            last_name: customerObject.last_name,
            phone: customerObject.phone,
            has_account: customerObject.has_account,
            vendor_id: customerObject.vendor_id, 
        });

        return await this.customerRepository.save(newCustomer);
    }

    async checkCustomerVendorAssociation(customerId: string, vendorId: string): Promise<boolean> {
        // Check if the customer is already associated with the vendor
        const association = await this.customerRepository.findOne({
          where: { id: customerId, vendor_id: vendorId }
        });
        return !!association;
      }

    // In customerService (or repository), ensure you fetch the `password_hash`
    async checkCustomerExists({ email }: { email: string }) {
        const customer = await this.customerRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password_hash', 'first_name', 'last_name'],
        });

        return customer;
    }


    async update(customerId: string, update: UpdateCustomerInput): Promise<Customer> {
        if (!customerId) {
            throw new Error("Customer ID is required to update a customer");
        }

        const existingCustomer = await this.customerRepository.findOne({ where: { id: customerId } });

        if (!existingCustomer) {
            throw new Error(`Customer with ID ${customerId} not found`);
        }

        const updatedCustomer = this.customerRepository.merge(existingCustomer, update);
        return await this.customerRepository.save(updatedCustomer);
    }

    async retrieve(customerId: string, config?: FindConfig<Customer>): Promise<Customer>{
        if (!customerId) {
            throw new Error("Customer ID is required to retrieve a customer");
        }

        const customer = await this.customerRepository.findOne({ where: { id: customerId } });

        if (!customer) {
            throw new Error(`Customer with ID ${customerId} not found`);
        }
        return  customer;
    }

    async delete(customerId: string): Promise<void> {
        if (!customerId) {
            throw new Error("Customer ID is required to delete a customer");
        }

        const existingCustomer = await this.customerRepository.findOne({ where: { id: customerId } });

        if (!existingCustomer) {
            throw new Error(`Customer with ID ${customerId} not found`);
        }

        await this.customerRepository.delete({ id: customerId });
    }

    async getCustomersByVendorId(vendorId: string): Promise<Customer[]> {
        if (!vendorId) {
            throw new Error("Vendor ID is required to retrieve customers");
        }

        const customers = await this.customerRepository.find({
            where: { vendor_id: vendorId }
        });

        return customers;
    }
    async retrieveByEmail(email: string): Promise<Customer[]> {
        if (!email) {
            throw new Error("Email ID is required to retrieve customers");
        }

        const customers = await this.customerRepository.find({
            where: { email: email }
        });

        return customers;
    }
}

export default CustomerService;
