import { Lifetime } from "awilix";
import {
    FindConfig,
    Order as MedusaOrder,
    OrderService as MedusaOrderService,
    Selector,
} from "@medusajs/medusa";
import { DeepPartial, FindOptionsWhere } from "typeorm";
import OrderRepository from "@medusajs/medusa/dist/repositories/order";
 
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

//     async list(selector: Selector<Order>, config?: FindConfig<Order>): Promise<Order[]> {
//     config = config || {};
//     return await this.orderRepository_.find({ where: selector, ...config });
//   }

//   async listAndCount(selector: Selector<Order>, config?:  FindConfig<Order>): Promise<[Order[], number]> {
//     config = config || {};
//     return await this.orderRepository_.findAndCount({ where: selector, ...config });
//   }

    async retrieve(orderId: string, config?: FindConfig<Order>): Promise<Order> {
        config = config || {};
        if (!orderId) {
            throw new Error("Order ID is required.");
        }
        console.log(`Fetching order with ID: ${orderId}`);
        const order = await this.orderRepository_.findOne({ where: { id: orderId } });        
        console.log(`Order retrieved: ${order ? order.id : 'not found'}`);
        if (!order) {
            throw new Error(`Order with ID ${orderId} not found.`);
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
