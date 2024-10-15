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

    // Get public_api_key from query
    const vendorId = req.query.vendor_id as string;

    // Validate public API key
    if (!vendorId) {
      console.error("VendorId is missing in request.");
      res.status(400).json({ error: "vendorId is required." });
      return;
    }

 
    // Fetch orders associated with the public API key
    const orders = await orderService.listOrdersByVendor(vendorId);

      res.status(200).json(orders);
  } catch (error) {
    console.error("Error in GET /orders:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};
