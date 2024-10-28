import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import OrderService from "../../../services/order";
import { vendorId } from "../../../services/mocks/saleschannelmock";

interface OrderData {
  vendor_id?: string; // Make vendor_id optional
  line_items: Array<{ product_id: string; quantity: number }>;
  billing_address?: Record<string, unknown>;
  shipping_address?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// Function to get the OrderService from the request context
const getOrderService = (req: MedusaRequest): OrderService | null => {
  try {
    return req.scope.resolve("orderService") as OrderService;
  } catch (error) {
    console.error("Failed to resolve orderService:", error);
    return null;
  }
};

// GET function to retrieve orders for a vendor
// GET function to retrieve orders for a vendor or a specific order by order_id
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

    // Get vendor_id and order_id from query
    const vendorId = req.query.vendor_id as string;
    const orderId = req.query.id as string;

    // Validate vendor_id
    // if (!vendorId) {
    //   console.error("vendorId is missing in request.");
    //   res.status(400).json({ error: "vendorId is required." });
    //   return;
    // }

    let response;

    // If order_id is provided, fetch the specific order
    if (orderId) {
      const order = await orderService.retrieve(orderId);
      if (!order) {
        res.status(404).json({ error: "Order not found." });
        return;
      }
      response = order;
    } else {
      // Fetch all orders associated with the vendorId
      const orders = await orderService.listOrdersByVendor(vendorId);
      response = orders;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in GET /orders:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

 