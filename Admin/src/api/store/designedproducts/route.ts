import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import DesignedProductService from "../../../services/designedproducts";

const getProductService = (req: MedusaRequest): DesignedProductService | null => {
  try {
    return req.scope.resolve("designproductService") as  DesignedProductService;
  } catch (error) {
    console.error("Failed to resolve designedproductService:", error);
    return null;
  }
};

// **GET ALL PRODUCTS** (List products by vendor ID)
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const productService = getProductService(req);
    if (!productService) {
      res.status(500).json({ error: "DesignedProduct service could not be resolved." });
      return;
    }

    const vendorId = req.query.vendorId as string;
    if (!vendorId) {
      res.status(400).json({ error: "Vendor ID is required." });
      return;
    }

    const products = await productService.retrieveByVendorId(vendorId);
    res.status(200).json({ message: "Products retrieved successfully.", products });
  } catch (error) {
    console.error("Error in GET_ALL /store/products:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};


// **CREATE A NEW PRODUCT**
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const productService = getProductService(req);
    if (!productService) {
      res.status(500).json({ error: "DesignedProduct service could not be resolved." });
      return;
    }

    const { vendor_id } = req.body as any;
    if (!vendor_id) {
      res.status(400).json({ error: "Vendor ID is required." });
      return;
    }

    const newProduct = await productService.create(req.body);
    res.status(201).json({ message: "Product created successfully.", product: newProduct });
  } catch (error) {
    console.error("Error in POST /store/products:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

