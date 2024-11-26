import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CartService from "../../../services/cart";
import { ICartItem } from "../../../types/cart";

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
    const customerId = req.query.id as string;

    if (!customerId) {
      res.status(400).json({ error: "Customer ID is required", message: "Customer ID is required"});
      return;
    }

    const carts = await cartService?.retrieveByCustomerId(customerId);

    if (!carts) {
      res.status(404).json({ error: "Cart not found", message: "Cart not found"});
      return;
    }

    res.status(200).json(carts);
  } catch (error) {
    console.error("Error in GET /cart:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

// POST method to create a new cart and add items
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

    const { 
      designs, 
      designState, 
      propsState, 
      quantity, 
      price, 
      email, 
      customer_id 
    } = req.body as {
      designs: any[];
      designState: any[];
      propsState: any;
      quantity: number;
      price: number;
      email: string;
      customer_id: string;
    };

    // Validate required fields
    if (!designs || !Array.isArray(designs) || designs.length === 0) {
      res.status(400).json({ error: "Designs array is required and cannot be empty.", message: "Designs array is required"});
      return;
    }
    if (!designState || !Array.isArray(designState)) {
      res.status(400).json({ error: "Design state is required and must be an array.", message: "Design state is required"});
      return;
    }
    if (!propsState) {
      res.status(400).json({ error: "Props state is required.", message: "Props state is required"});
      return;
    }
    if (!quantity || typeof quantity !== "number") {
      res.status(400).json({ error: "Quantity is required and should be a number.", message: "Quantity is required and should be a number"});
      return;
    }
    if (!price || typeof price !== "number") {
      res.status(400).json({ error: "Price is required and should be a number.", message: "Price is required and should be a number"});
      return;
    }
    if (!email || typeof email !== "string") {
      res.status(400).json({ error: "Email is required and should be a string.", message: "Email is required and should be a string"});
      return;
    }
    if (!customer_id || typeof customer_id !== "string") {
      res.status(400).json({ error: "Customer ID is required and should be a string.", message: "Customer ID is required and should be a string"});
      return;
    }

    const cartData = { 
      designs, 
      designState, 
      propsState, 
      quantity, 
      price, 
      email, 
      customer_id 
    };
    
    const cart = await cartService.create(cartData);
    const carts = await cartService?.retrieveByCustomerId(cart.customer_id);

    res.status(201).json(carts);
  } catch (error) {
    console.error("Error in POST /store/cart:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

// PATCH method to update quantity
export const PATCH = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const cartService = getCartService(req);
    const { cartId } = req.query;
    const { quantity } = req.body as { quantity: number };

    if (!cartId) {
      res.status(400).json({ error: "Cart ID is required", message: "Please enter a valid cart ID." });
      return;
    }

    if (typeof quantity !== "number" || quantity < 1) {
      res.status(400).json({ error: "Valid quantity is required", message: "Please enter a valid quantity." });
      return;
    }

    const updatedCart = await cartService?.updateQuantity(cartId as string, quantity);
    const customerCarts = await cartService?.retrieveByCustomerId(updatedCart.customer_id);
    res.status(200).json(customerCarts);
  } catch (error) {
    console.error("Error in PATCH /cart:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const cartService = getCartService(req);
    const { cartId } = req.query;

    if (!cartId) {
      res.status(400).json({ error: "Cart ID is required", message: "Please enter a cart ID." });
      return;
    }

    await cartService?.deleteCart(cartId as string);
    res.status(200).json({ message: "Cart successfully deleted" });
  } catch (error) {
    console.error("Error in DELETE /cart:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const cartService = getCartService(req);
    const { cartId } = req.query as any;
    const { designState, propsState, designs } = req.body as any;

    if (!cartId) {
      res.status(400).json({ error: "Cart ID is required", message: "Please enter a valid cart Id" });
      return;
    }

    const updatedCartData = await cartService?.update(cartId, { designState, propsState, designs });
    res.status(200).json({ updatedCartData, message: "Cart Updated Successfully" });
  } catch (error) {
    console.error("Error in PUT /cart:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};