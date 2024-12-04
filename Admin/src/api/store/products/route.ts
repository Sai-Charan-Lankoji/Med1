import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductService from '../../../services/product';
// import { parseCookies } from 'nookies';
import { Product } from "../../../models/product";

const getProductService = (req: MedusaRequest): ProductService | null => {
  try {
    return req.scope.resolve("productService") as ProductService;
  } catch (error) {
    console.error("Failed to resolve productService:", error);
    return null;
  }
};

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const productService = getProductService(req as any);
    if (!productService) {
      console.error("Product service could not be resolved.");
      res.status(500).json({ error: "Product service could not be resolved." });
      return;
    }
    const storeId = req.query.storeId as string;

    if (!storeId) {
      res.status(400).json({ error: "Store ID is required", message: "Store ID is required"});
      return;
    }

    const products = await productService.retrieveByStoreId(storeId);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in GET /store/products:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};


export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {

    const productService = getProductService(req as any);
    if (!productService) {
      console.error("Product service could not be resolved.");
      res.status(500).json({ error: "Product service could not be resolved." });
      return;
    }

    const { vendor_id } = req.body as any; // Typecast as ProductData

    if (!vendor_id) {
      res.status(400).json({ error: "Vendor ID is required.", message: "Vendor ID is required." });
      return;
    }

    const newProductData: Partial<Product> = req.body;
    const productDataWithVendor = {
      ...newProductData,
      vendor_id,
    };

    const newProduct = await productService.create(productDataWithVendor as any);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error in POST /admin/products:", error);
    res.status(500).json({ error: error || "An unknown error occurred." });
  }
};

