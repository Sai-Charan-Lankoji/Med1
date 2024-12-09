import orderRepositoryMock from '../../mocks/ordermock';
import OrderService from '../order';

describe('OrderService', () => {
    let orderService;
    let mockManager;

    beforeEach(() => {

        const container = {
            orderRepository: orderRepositoryMock,
            manager: mockManager,
        };

        orderService = new OrderService(container);

        // Clear mocks before each test to ensure a clean state
        jest.clearAllMocks();
    });

    describe('retrieveOrder', () => {
        it('should retrieve an order by ID', async () => {
            const orderId = 'order-1';
            const order = { id: orderId, status: 'pending', vendor_id: 'vendor-1' };

            orderRepositoryMock.findOne.mockResolvedValue(order);

            const result = await orderService.retrieveOrder(orderId);

            expect(orderRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: orderId } });
            expect(result).toEqual(order);
        });

        it('should throw an error if the order does not exist', async () => {
            const orderId = 'non-existing-order';

            orderRepositoryMock.findOne.mockResolvedValue(null);

            await expect(orderService.retrieveOrder(orderId))
                .rejects
                .toThrow("Order not found");

            expect(orderRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: orderId } });
        });
    });

    describe('createOrder', () => {
        it('should create a new order', async () => {
            const orderData = { vendor_id: 'vendor-1', status: 'pending' };
            const createdOrder = { id: 'order-1', ...orderData };

            orderRepositoryMock.create.mockReturnValue(createdOrder);
            orderRepositoryMock.save.mockResolvedValue(createdOrder);

            const result = await orderService.createOrder(orderData);

            expect(orderRepositoryMock.create).toHaveBeenCalledWith({
                ...orderData,
                status: orderData.status || 'pending',
            });
            expect(orderRepositoryMock.save).toHaveBeenCalledWith(createdOrder);
            expect(result).toEqual(createdOrder);
        });

        it('should throw an error if vendor ID is missing', async () => {
            const orderData = { status: 'pending' };

            await expect(orderService.createOrder(orderData))
                .rejects
                .toThrow("Vendor ID is required to create an order");
        });
    });

    describe('listOrdersByVendor', () => {
        it('should return orders for a given vendor', async () => {
            const vendorId = 'vendor-1';
            const orders = [
                { id: 'order-1', vendor_id: vendorId, status: 'pending' },
                { id: 'order-2', vendor_id: vendorId, status: 'completed' },
            ];

            orderRepositoryMock.find.mockResolvedValue(orders);

            const result = await orderService.listOrdersByVendor(vendorId);

            expect(orderRepositoryMock.find).toHaveBeenCalledWith({ where: { vendor_id: vendorId } });
            expect(result).toEqual(orders);
        });

        it('should throw an error if vendor ID is missing', async () => {
            await expect(orderService.listOrdersByVendor(null))
                .rejects
                .toThrow("Vendor ID is required.");
        });
    });

    describe('deleteOrder', () => {
        it('should delete an order by ID', async () => {
            const orderId = 'order-1';
            const order = { id: orderId, vendor_id: 'vendor-1', status: 'pending' };

            orderRepositoryMock.findOne.mockResolvedValue(order);

            await orderService.deleteOrder(orderId);

            expect(orderRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: orderId } });
            expect(orderRepositoryMock.delete).toHaveBeenCalledWith({ id: orderId });
        });

        it('should throw an error if the order does not exist', async () => {
            const orderId = 'non-existing-order';

            orderRepositoryMock.findOne.mockResolvedValue(null);

            await expect(orderService.deleteOrder(orderId))
                .rejects
                .toThrow(`Order with ID ${orderId} not found`);

            expect(orderRepositoryMock.findOne).toHaveBeenCalledWith({ where: { id: orderId } });
        });
    });
});
