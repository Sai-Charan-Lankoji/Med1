import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CartService from "../../../../services/cart"; // Adjust the import path as necessary
  
const getCartService = (req: MedusaRequest): CartService | null => {
  try {
    return req.scope.resolve("cartService") as CartService;
  } catch (error) {
    console.error("Failed to resolve cartService:", error);
    return null;
  }
};

 

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
      const cartService = getCartService(req);
      const  customer_id  = req.params.id as any;

      if (!customer_id) {
          res.status(400).json({ error: "Customer ID is required" });
          return;
      }

      await cartService?.clearCustomerCart(customer_id as string);
      res.status(200).json({ message: "All carts successfully cleared" });
  } catch (error) {
      console.error("Error in PUT /cart:", error);
      res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};