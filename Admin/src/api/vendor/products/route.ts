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
    const productService = req.scope.resolve("productService") as ProductService;

    const vendorId = req.query.vendorId as string;

    if (!vendorId) {
      res.status(400).json({ error: "Vendor ID is required" });
      return;
    }

    const products = await productService.retrieveByVendorId(vendorId);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in GET /store/vendor/products:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};


interface ProductData {
  title: string;
  subtitle: string;
  handle: string;
  material: string;
  description: string;
  discountable: boolean;
  type: string;
  tags: string;
  width: string;
  length: string;
  height: string;
  weight: string;
  mid_code: string;
  hs_code: string;
  origin_country: string;
  thumbnail: string;
  vendor_id: string; // Ensure this matches the frontend
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    console.log("Request body:", req.body);

    const productService = getProductService(req as any);
    if (!productService) {
      console.error("Product service could not be resolved.");
      res.status(500).json({ error: "Product service could not be resolved." });
      return;
    }

    const { vendor_id } = req.body as ProductData; // Typecast as ProductData

    if (!vendor_id) {
      console.error("Vendor ID is missing in request body.");
      res.status(400).json({ error: "Vendor ID is required." });
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
    console.error("Error in POST /products:", error);
    res.status(500).json({ error: error || "An unknown error occurred." });
  }
};

