import { 
    dataSource,
  } from "@medusajs/medusa/dist/loaders/database"
  import { Customer } from "@medusajs/medusa"
  import {
    CustomerRepository as MedusaCustomerRepository,
  } from "@medusajs/medusa/dist/repositories/customer"
  
  export const CustomerRepository = dataSource
    .getRepository(Customer)
    .extend({
      ...Object.assign(
        MedusaCustomerRepository, 
        { target: Customer }
      ),
    })
  
  export default CustomerRepository