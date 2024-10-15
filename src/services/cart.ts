import { Lifetime } from "awilix";
import { Cart, CartService as MedusaCartService } from "@medusajs/medusa";
import { CartCreateProps, CartUpdateProps } from "@medusajs/medusa/dist/types/cart";

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
    async create(data: CartCreateProps): Promise<Cart> {
      const cart = this.cartRepository.create(data);
      return await this.cartRepository.save(cart);
    }
  
    async retrieveByCustomerId(customerId: string): Promise<Cart | null> {
      return await this.cartRepository.findOne({
        where: { customer_id: customerId },
        relations: ["billing_address", "shipping_address", "items", "discounts", "gift_cards"],
      });
    }
  

  async addOrUpdateLineItems(cartId: string, lineItems: LineItem | LineItem[], config?: {
    validateSalesChannels?: boolean;
}): Promise<void> {
    const cart = await this.cartRepository.findOne({ where: { id: cartId } });
    if (!cart) {
        throw new Error(`Cart with ID ${cartId} not found.`);
    }

    // Ensure line_items is initialized
    cart.line_items = cart.line_items || [];

    const itemsToAdd = Array.isArray(lineItems) ? lineItems : [lineItems];

    for (const item of itemsToAdd) {
        const existingItemIndex = cart.line_items.findIndex((lineItem: LineItem) => lineItem.id === item.id);
        if (existingItemIndex !== -1) {
            cart.line_items[existingItemIndex] = { ...cart.line_items[existingItemIndex], ...item };
        } else {
            cart.line_items.push(item);
        }
    }

    await this.cartRepository.save(cart);
}


    async updateLineItemQuantity(cartId: string, itemId: string, quantity: number): Promise<Cart> {
        const cart = await this.cartRepository.findOne({ where: { id: cartId } });
        if (!cart) {
            throw new Error(`Cart with ID ${cartId} not found.`);
        }

        const lineItem = cart.line_items.find((item: LineItem) => item.id === itemId);
        if (!lineItem) {
            throw new Error(`Line item with ID ${itemId} not found in cart.`);
        }

        lineItem.quantity = quantity;
        return await this.cartRepository.save(cart);
    }

    async deleteLineItem(cartId: string, itemId: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({ where: { id: cartId } });
        if (!cart) {
            throw new Error(`Cart with ID ${cartId} not found.`);
        }

        cart.line_items = cart.line_items.filter((item: LineItem) => item.id !== itemId);
        return await this.cartRepository.save(cart);
    }

    async update(cartId: string, updateProps: CartUpdateProps): Promise<Cart> {
        const cart = await this.cartRepository.findOne({ where: { id: cartId } });
        if (!cart) {
            throw new Error(`Cart with ID ${cartId} not found.`);
        }

        Object.assign(cart, updateProps);
        return await this.cartRepository.save(cart);
    }

    async retrieve(cartId: string): Promise<Cart> {
        const cart = await this.cartRepository.findOne({ where: { id: cartId } });
        if (!cart) {
            throw new Error('Cart not found.');
        }
        return cart;
    }
}

export default CartService;
