import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductService from '../../../services/product';

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
    const vendorId = req.query.vendorId as string;

    if (!vendorId) {
      res.status(400).json({ error: "Vendor ID is required", message: "Vendor ID is required"});
      return;
    }

    const products = await productService.retrieveByVendorId(vendorId);

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in GET /vendor/products:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};