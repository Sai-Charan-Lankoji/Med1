import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import OrderService from "../../../services/order";
interface OrderData {
  status: string;
  fulfillment_status: string;
  payment_status: string;
  customer_id: string;
  vendor_id: string;
  store_id: string;
  email: string;
  region_id: string;
  currency_code: string;
  public_api_key: string;
  line_items: {
    product_id: string;
    quantity: number;
    price: number;
    designs: any
  }[];
  total_amount: string;
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

    const { line_items, public_api_key, customer_id, total_amount, store_id, ...rest } =
      req.body as OrderData;

    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      console.error("Line items are missing or invalid in request body.");
      res.status(400).json({ error: "At least one line item is required.", message: "Missing line items"});
      return;
    }

    const newOrderData = {
      line_items,
      public_api_key,
      customer_id,
      store_id,
      vendor_id: rest.vendor_id, // Make sure vendor_id is included
      total_amount,
      ...rest,
    };
    const newOrder = await orderService.createOrder(newOrderData as any);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error in POST /orders:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};