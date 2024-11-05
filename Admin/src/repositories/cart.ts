import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import { Cart } from "@medusajs/medusa/dist/models"
import {
  CartRepository as MedusaCartRepository,
} from "@medusajs/medusa/dist/repositories/cart"

export const CartRepository = dataSource
  .getRepository(Cart)
  .extend({
    ...Object.assign(
      MedusaCartRepository, 
      { target: Cart }
    ),
  })

export default CartRepository
