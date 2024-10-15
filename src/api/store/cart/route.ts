import type { LineItem, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CartService from "../../../services/cart"; // Adjust the import path as necessary
import { CartCreateProps } from "@medusajs/medusa/dist/types/cart";

const getCartService = (req: MedusaRequest): CartService | null => {
  try {
    return req.scope.resolve("cartService") as CartService;
  } catch (error) {
    console.error("Failed to resolve cartService:", error);
    return null;
  }
};

// GET method to retrieve the cart for a specific customer
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const cartService = getCartService(req);

    const customerId = req.query.customerId as string;

    if (!customerId) {
      res.status(400).json({ error: "Customer ID is required" });
      return;
    }

    const cart = await cartService.retrieveByCustomerId(customerId);

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error in GET /cart:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

// POST method to add products to the cart
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    console.log("Request body:", req.body);

    const cartService = getCartService(req);
    if (!cartService) {
      console.error("Cart service could not be resolved.");
      res.status(500).json({ error: "Cart service could not be resolved." });
      return;
    }

    const { customer_id, lineItems } = req.body as { customer_id: string; lineItems: LineItem[] };

    if (!customer_id) {
      console.error("Customer ID is missing in request body.");
      res.status(400).json({ error: "Customer ID is required." });
      return;
    }

    // Try to retrieve the cart for the customer
    let cart = await cartService.retrieveByCustomerId(customer_id);
    // If cart does not exist, create it
    if (!cart) {
      const cartCreateProps: CartCreateProps = { customer_id }; // Add any other necessary properties
      cart = await cartService.create(cartCreateProps);
    }

    // Add line items to the cart
    await cartService.addOrUpdateLineItems(cart.id, lineItems);
    res.status(201).json({ cart });
  } catch (error) {
    console.error("Error in POST /cart:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};
