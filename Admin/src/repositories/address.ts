import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"
import { Address } from "../models/address"
import {
  AddressRepository as MedusaAddressRepository,
} from "@medusajs/medusa/dist/repositories/address"

export const AddressRepository = dataSource
  .getRepository(Address)
  .extend({
    ...Object.assign(
        MedusaAddressRepository, 
      { target: Address }
    ),
  })

export default AddressRepository