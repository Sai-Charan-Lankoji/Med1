import { Lifetime } from "awilix";
import { Cart, CartService as MedusaCartService } from "@medusajs/medusa";
import { ICartItem, IDesign, IProps } from "../types/cart";
import e from "express";

class CartService extends MedusaCartService {
    static LIFE_TIME = Lifetime.SCOPED;
    private readonly cartRepository: any;

    constructor(container) {
        super(container);
        try {
            this.cartRepository = container.cartRepository;
        } catch (e) {
            console.error("Error initializing CartService:", e);
        }
    }

    calculatePrice(designs: any[]): number {
        return designs.length * 100;
    }

    async create(data: ICartItem): Promise<Cart> {
        if (!data.designs || !Array.isArray(data.designs)) {
            throw new Error("Designs must be provided as an array.");
        }
        if (!data.designState || !Array.isArray(data.designState)) {
            throw new Error("Design state must be provided as an array.");
        }
        if (!data.propsState) {
            throw new Error("Props state must be provided.");
        }
        if (typeof data.price !== "number") {
            throw new Error("Price must be a number.");
        }
        if (typeof data.quantity !== "number") {
            throw new Error("Quantity must be a number.");
        }
        if (!data.email || typeof data.email !== "string") {
            throw new Error("A valid email is required.");
        }
        if (!data.customer_id || typeof data.customer_id !== "string") {
            throw new Error("Customer ID is required.");
        }
        const basePrice = this.calculatePrice(data.designs);
        const totalPrice = basePrice * data.quantity;

        const cartData = {
            designs: data.designs,
            designState: data.designState,
            propsState: data.propsState,
            price: basePrice,
            quantity: data.quantity,
            total_price: totalPrice,
            email: data.email,
            customer_id: data.customer_id,
        };

        try {
                const cart = this.cartRepository.create(cartData);
                return await this.cartRepository.save(cart);
        
        } catch (error) {
            console.error("Error creating cart:", error);
            throw new Error("Failed to create the cart.");
        }
    }

    async update(cartId: string, { designState, propsState, designs }: any): Promise<Cart> {
        const existingCart = await this.cartRepository.findOne({ where: { id: cartId } });
        if (!existingCart) {
          throw new Error(`Cart with ID ${cartId} not found.`);
        }
      
        existingCart.designState = designState;
        existingCart.propsState = propsState;
        existingCart.designs = designs;
      
        return await this.cartRepository.save(existingCart);
      }

    async retrieveByCustomerId(customerId: string): Promise<Cart | null> {
      return await this.cartRepository.find({
          where: { customer_id: customerId },
          relations: ["billing_address", "shipping_address", "items", "discounts", "gift_cards"],
      });
  }

  async deleteCart(cartId: string): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    if (!cart) {
        throw new Error(`Cart with ID ${cartId} not found.`);
    }

    await this.cartRepository.remove(cart);
}

    async updateQuantity(cartId: string, quantity: number): Promise<Cart> {
      if (quantity < 1) {
          throw new Error("Quantity must be at least 1");
      }

      const cart = await this.cartRepository.findOne({ where: { id: cartId } });
      if (!cart) {
          throw new Error(`Cart with ID ${cartId} not found.`);
      }

      // Update quantity and recalculate total price
      cart.quantity = quantity;
      cart.total_price = cart.price * quantity;

      return await this.cartRepository.save(cart);
  }
  async clearCustomerCart(customerId: string): Promise<void> {
    try {
        const carts = await this.cartRepository.find({
            where: { customer_id: customerId }
        });

        if (!carts || carts.length === 0) {
            throw new Error(`No carts found for customer ${customerId}`);
        }

        await this.cartRepository.remove(carts);
    } catch (error) {
        console.error("Error clearing customer cart:", error);
        throw new Error("Failed to clear customer cart");
    }
}
      
        
}

export default CartService;

{/* import { Lifetime } from "awilix";
import { Cart, CartService as MedusaCartService } from "@medusajs/medusa";
import { CartCreateProps, CartUpdateProps } from "@medusajs/medusa/dist/types/cart";
import { ICartItem } from "../types/cart"; 



  

type LineItem = {
    id: string;
    quantity: number;
};

class CartService extends MedusaCartService {
    static LIFE_TIME = Lifetime.SCOPED;
    private readonly cartRepository: any;

    constructor(container) {
        super(container);
        try {
            this.cartRepository = container.cartRepository;
        } catch (e) {
            console.error("Error initializing CartService:", e);
        }
    }

    async create(data: ICartItem): Promise<Cart> {
        // Validate essential fields before attempting to create a cart
        if (!data.designs || !Array.isArray(data.designs)) {
          throw new Error("Designs must be provided as an array.");
        }
        if (typeof data.price !== "number") {
          throw new Error("Price must be a number.");
        }
        if (typeof data.quantity !== "number") {
          throw new Error("Quantity must be a number.");
        }
        if (!data.email || typeof data.email !== "string") {
          throw new Error("A valid email is required.");
        }
        if (!data.customer_id || typeof data.customer_id !== "string") {
          throw new Error("Customer ID is required.");
        }
      
        // Prepare cart data, ensuring defaults are used for optional fields
        const cartData = {
          designs: data.designs,
          price: data.price,
          quantity: data.quantity,
          email: data.email,
          customer_id: data.customer_id,
          ...data,  // Spread additional fields if any
        };
      
        try {
          // Create and save the cart
          const cart = this.cartRepository.create(cartData);
          return await this.cartRepository.save(cart);
        } catch (error) {
          console.error("Error creating cart:", error);
          throw new Error("Failed to create the cart.");
        }
      }
      

    async retrieveByCustomerId(customerId: string): Promise<Cart | null> {
        return await this.cartRepository.find({
            where: { customer_id: customerId },
            relations: ["billing_address", "shipping_address", "items", "discounts", "gift_cards"],
        });
    }

    // async addOrUpdateLineItems(cartId: string, lineItems: LineItem | LineItem[], config?: {
    //     validateSalesChannels?: boolean;
    // }): Promise<void> {
    //     const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    //     if (!cart) {
    //         throw new Error(`Cart with ID ${cartId} not found.`);
    //     }

    //     // Ensure line_items is initialized
    //     cart.line_items = cart.line_items || [];

    //     const itemsToAdd = Array.isArray(lineItems) ? lineItems : [lineItems];

    //     for (const item of itemsToAdd) {
    //         const existingItemIndex = cart.line_items.findIndex((lineItem: LineItem) => lineItem.id === item.id);
    //         if (existingItemIndex !== -1) {
    //             cart.line_items[existingItemIndex] = { ...cart.line_items[existingItemIndex], ...item };
    //         } else {
    //             cart.line_items.push(item);
    //         }
    //     }

    //     await this.cartRepository.save(cart);
    // }

    // async updateLineItemQuantity(cartId: string, itemId: string, quantity: number): Promise<Cart> {
    //     const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    //     if (!cart) {
    //         throw new Error(`Cart with ID ${cartId} not found.`);
    //     }

    //     const lineItem = cart.line_items.find((item: LineItem) => item.id === itemId);
    //     if (!lineItem) {
    //         throw new Error(`Line item with ID ${itemId} not found in cart.`);
    //     }

    //     lineItem.quantity = quantity;
    //     return await this.cartRepository.save(cart);
    // }

    // async deleteLineItem(cartId: string, itemId: string): Promise<Cart> {
    //     const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    //     if (!cart) {
    //         throw new Error(`Cart with ID ${cartId} not found.`);
    //     }

    //     cart.line_items = cart.line_items.filter((item: LineItem) => item.id !== itemId);
    //     return await this.cartRepository.save(cart);
    // }

    // async update(cartId: string, updateProps: CartUpdateProps): Promise<Cart> {
    //     const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    //     if (!cart) {
    //         throw new Error(`Cart with ID ${cartId} not found.`);
    //     }

    //     Object.assign(cart, updateProps);
    //     return await this.cartRepository.save(cart);
    // }

    // async retrieve(cartId: string): Promise<Cart> {
    //     const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    //     if (!cart) {
    //         throw new Error('Cart not found.');
    //     }
    //     return cart;
    // }
}

export default CartService;
*/}
