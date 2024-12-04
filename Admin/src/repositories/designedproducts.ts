import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { Repository } from "typeorm";
import { DesignedProduct } from "../models/designedproducts";

export const DesignedProductRepository = dataSource.getRepository(DesignedProduct).extend({
  // Custom repository methods can be added here if needed
});

export default DesignedProductRepository;
