import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import OrderService from "../../../services/order";

interface OrderData {
    status: string; // Add status field
    fulfillment_status: string; // Add fulfillment_status field
    payment_status: string; // Add payment_status field
    customer_id: string; // Include customer_id
    vendor_id: string; // Make vendor_id required
    email: string; // Add email field
    region_id: string; // Add region_id field
    currency_code: string; // Add currency_code field
    public_api_key: string; // Include public_api_key
    line_items: { // Specify structure for line items
        product_id: string;
        quantity: number;
        price: number;
        thumbnail_url: any;
        upload_url: any
        background_image_url : string;
        background_image_color : string;
    }[];
    total_amount: string; // Include total_amount
}

const getOrderService = (req: MedusaRequest): OrderService | null => {
    try {
        return req.scope.resolve("orderService") as OrderService;
    } catch (error) {
        console.error("Failed to resolve orderService:", error);
        return null;
    }
};



export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
      console.log("Request body:", req.body);
      const orderService = getOrderService(req);
      if (!orderService) {
          console.error("Order service could not be resolved.");
          res.status(500).json({ error: "Order service could not be resolved." });
          return;
      }

      // Destructure all necessary fields from the request body
      const { line_items, public_api_key, customer_id, total_amount, ...rest } = req.body as OrderData ;

      // Ensure line_items is provided
      if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
          console.error("Line items are missing or invalid in request body.");
          res.status(400).json({ error: "At least one line item is required." });
          return;
      }

      const newOrderData = {
          line_items,
          public_api_key,
          customer_id, // Include customer_id
          total_amount, // Include total_amount
          ...rest, // Include any other fields as necessary
      };

      const newOrder = await orderService.createOrder(newOrderData as any);
      res.status(201).json(newOrder);
  } catch (error) {
      console.error("Error in POST /orders:", error);
      res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};
 