import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import OrderService from "../../../../services/order"; 

// Function to get the OrderService from the request context
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
    const orderService = getOrderService(req);
    if (!orderService) {
      console.error("Order service could not be resolved.");
      res.status(500).json({ error: "Order service could not be resolved." });
      return;
    }

    const orderId = req.params.id as string;

    
    let response;

    if (orderId) {
      const order = await orderService.retrieve(orderId);
      if (!order) {
        res.status(404).json({ error: "Order not found.", message: "Order not found." });
        return;
      }
      response = order;
    } else {
       const orders = await orderService.retrieve(orderId);
      response = orders;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in GET /vendor/orders/[id]:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};
