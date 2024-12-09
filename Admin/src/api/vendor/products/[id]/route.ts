import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductService from "../../../../services/product";

const getProductService = (req: MedusaRequest): ProductService | null => {
  try {
    return req.scope.resolve("productService") as ProductService;
  } catch (error) {
    console.error("Failed to resolve productService:", error);
    return null;
  }
};

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const productService = getProductService(req as any);
    if (!productService) {
      res.status(500).json({ error: "Product service could not be resolved." });
      return;
    }

    const productId = req.params.id;
    const updateData = req.body;

    const updatedProduct = await productService.update(productId, updateData);
    res.status(200).json({
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error in PUT /products/:id:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};
