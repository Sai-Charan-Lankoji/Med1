import { Lifetime } from "awilix";
import {
    Order as MedusaOrder,
    OrderService as MedusaOrderService,
} from "@medusajs/medusa";
import OrderRepository from "@medusajs/medusa/dist/repositories/order";
import { DeepPartial, FindOptionsWhere } from "typeorm";
 
enum OrderStatus {
  Pending = "pending",
  Completed = "completed",
  Archived = "archived",
  Canceled = "canceled",
  RequiresAction = "requires_action"
}


type Order = MedusaOrder & {
    vendor_id?: string;
};

interface CreateOrderData {
    vendor_id: string;
    status?: OrderStatus;
}

class OrderService extends MedusaOrderService {
    static readonly LIFE_TIME = Lifetime.SCOPED;
    protected readonly orderRepository_: typeof OrderRepository;

    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
    }

    async retrieve(orderId: string): Promise<Order> {
        if (!orderId) {
            throw new Error("Order ID is required.");
        }

        const order = await this.orderRepository_.findOne({ where: { id: orderId } });
        if (!order) {
            throw new Error("Order not found.");
        }

        return order;
    }

    async createOrder(orderData: CreateOrderData): Promise<Order> {
      if (!orderData.vendor_id) {
          throw new Error("Vendor ID is required to create an order.");
      }
  
      const order: DeepPartial<Order> = {
          ...orderData,
          status: orderData.status as any || OrderStatus.Pending,
      };
  
      const newOrder = this.orderRepository_.create(order);
      return await this.orderRepository_.save(newOrder);
  }

    async listOrdersByVendor(vendorId: string): Promise<Order[]> {
        if (!vendorId) {
            throw new Error("Vendor ID is required.");
        }

        const whereClause: FindOptionsWhere<Order> = { vendor_id: vendorId };

        // Fetch orders matching the vendorId
        return this.orderRepository_.find({ where: whereClause });
    }

    async deleteOrder(orderId: string): Promise<void> {
        if (!orderId) {
            throw new Error("Order ID is required to delete an order.");
        }

        const existingOrder = await this.orderRepository_.findOne({ where: { id: orderId } });
        if (!existingOrder) {
            throw new Error(`Order with ID ${orderId} not found.`);
        }

        await this.orderRepository_.delete({ id: orderId });
    }
}

export default OrderService;
