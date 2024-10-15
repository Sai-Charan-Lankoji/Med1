import CustomerService from '../customer';
import { EntityManager } from 'typeorm';
import customerRepositoryMock from '../mocks/customermock';

describe('CustomerService', () => {
    let customerService;
    let mockManager;
    beforeEach(() => {
        const container = {
            customerRepository: customerRepositoryMock,
            manager: mockManager,
        };

        customerService = new CustomerService(container);

        // Reset mocks before each test to ensure clean state
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new customer if one does not already exist', async () => {
            const customerInput = {
                email: 'test@example.com',
                first_name: 'John',
                last_name: 'Doe',
                phone: '1234567890',
                password_hash: 'hashedPassword',
                vendor_id: 'vendor-1',
            };

            customerRepositoryMock.findOne.mockResolvedValue(null);
            customerRepositoryMock.create.mockReturnValue(customerInput);
            customerRepositoryMock.save.mockResolvedValue(customerInput);

            const result = await customerService.create(customerInput);

            expect(customerRepositoryMock.create).toHaveBeenCalledWith(customerInput);
            expect(customerRepositoryMock.save).toHaveBeenCalledWith(customerInput);
            expect(result).toEqual(customerInput);
        });

        it('should throw an error if the customer already exists', async () => {
            const customerInput = { email: 'test@example.com' };
            const existingCustomer = { id: '1', email: 'test@example.com' };

            customerRepositoryMock.findOne.mockResolvedValue(existingCustomer);

            await expect(customerService.create(customerInput))
                .rejects
                .toThrow(`Customer with the given details already exists.`);

            expect(customerRepositoryMock.findOne).toHaveBeenCalledWith({
                where: { email: customerInput.email },
                select: ['id', 'email', 'password_hash', 'first_name', 'last_name'],
            });
        });
    });

    describe('update', () => {
        it('should update an existing customer', async () => {
            const customerId = '1';
            const updateInput = { first_name: 'Updated' };
            const existingCustomer = { id: '1', first_name: 'John', last_name: 'Doe' };

            customerRepositoryMock.findOne.mockResolvedValue(existingCustomer);
            customerRepositoryMock.merge.mockReturnValue({ ...existingCustomer, ...updateInput });
            customerRepositoryMock.save.mockResolvedValue({ ...existingCustomer, ...updateInput });

            const result = await customerService.update(customerId, updateInput);

            expect(customerRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: customerId } });
            expect(customerRepositoryMock.merge).toHaveBeenCalledWith(existingCustomer, updateInput);
            expect(customerRepositoryMock.save).toHaveBeenCalledWith({ ...existingCustomer, ...updateInput });
            expect(result).toEqual({ ...existingCustomer, ...updateInput });
        });

        it('should throw an error if the customer does not exist', async () => {
            const customerId = '1';
            const updateInput = { first_name: 'Updated' };

            customerRepositoryMock.findOne.mockResolvedValue(null);

            await expect(customerService.update(customerId, updateInput))
                .rejects
                .toThrow(`Customer with ID ${customerId} not found`);

            expect(customerRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: customerId } });
        });
    });

    describe('delete', () => {
        it('should delete an existing customer', async () => {
            const customerId = '1';
            const existingCustomer = { id: '1', email: 'test@example.com' };

            customerRepositoryMock.findOne.mockResolvedValue(existingCustomer);

            await customerService.delete(customerId);

            expect(customerRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: customerId } });
            expect(customerRepositoryMock.delete).toHaveBeenCalledWith({ id: customerId });
        });

        it('should throw an error if the customer does not exist', async () => {
            const customerId = '1';

            customerRepositoryMock.findOne.mockResolvedValue(null);

            await expect(customerService.delete(customerId))
                .rejects
                .toThrow(`Customer with ID ${customerId} not found`);

            expect(customerRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: customerId } });
        });
    });

    describe('getCustomersByVendorId', () => {
        it('should return customers by vendor ID', async () => {
            const vendorId = 'vendor-1';
            const customers = [
                { id: '1', email: 'customer1@example.com', vendor_id: vendorId },
                { id: '2', email: 'customer2@example.com', vendor_id: vendorId },
            ];

            customerRepositoryMock.find.mockResolvedValue(customers);

            const result = await customerService.getCustomersByVendorId(vendorId);

            expect(customerRepositoryMock.find).toHaveBeenCalledWith({ where: { vendor_id: vendorId } });
            expect(result).toEqual(customers);
        });

        it('should throw an error if vendor ID is not provided', async () => {
            await expect(customerService.getCustomersByVendorId(null))
                .rejects
                .toThrow("Vendor ID is required to retrieve customers");
        });
    });
});
