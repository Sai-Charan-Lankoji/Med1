import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import OrderService from "../../../../services/order";
const getOrderService = (req: MedusaRequest): OrderService | null => {
    try {
        return req.scope.resolve("orderService") as OrderService;
    } catch (error) {
        console.error("Failed to resolve orderService:", error);
        return null;
    }
};


export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ): Promise<void> => {
    try {
      const orderService = getOrderService(req as any);
      if (!orderService) {
        res.status(500).json({ error: "Order service could not be resolved." });
        return;
      }
      const orderId = req.params.id as string;
  
      if (!orderId) {
        res.status(400).json({ error: "Order ID is required." });
        return;
      }
  
      console.log(`Retrieving order with ID: ${orderId}`);
      const order = await orderService.retrieve(orderId);
      
      if (!order) {
        console.error(`Order with ID ${orderId} not found.`);
        res.status(404).json({ error: `Order with ID ${orderId} not found.` });
      } else {
        res
          .status(200)
          .json({ message: "Order retrieved successfully.", order });
      }
    } catch (error) {
      console.error("Error in GET /vendor/orders/[id]:", error);
      res
        .status(500)
        .json({ error: error.message || "An unknown error occurred." });
    }
  };