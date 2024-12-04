
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import DesignedProductService from "../../../../services/designedproducts";

const getProductService = (req: MedusaRequest): DesignedProductService | null => {
  try {
    return req.scope.resolve("designproductService") as  DesignedProductService;
  } catch (error) {
    console.error("Failed to resolve designedproductService:", error);
    return null;
  }
}

// **GET A SINGLE PRODUCT**
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
  
      const productId = req.params.id as string;
      if (!productId) {
        res.status(400).json({ error: "Product ID is required." });
        return;
      }
  
      const product = await productService.retrieve(productId);
      res.status(200).json({ message: "Product retrieved successfully.", product });
    } catch (error) {
      console.error("Error in GET /products/:id:", error);
      res.status(500).json({ error: error.message || "An unknown error occurred." });
    }
  };

  
// **UPDATE AN EXISTING PRODUCT**
export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
  ): Promise<void> => {
    try {
      const productService = getProductService(req);
      if (!productService) {
        res.status(500).json({ error: "Product service could not be resolved." });
        return;
      }
  
      const productId = req.params.id;
      const updateData = req.body;
  
      const updatedProduct = await productService.update(productId, updateData);
      res.status(200).json({ message: "DesignedProduct updated successfully.", product: updatedProduct });
    } catch (error) {
      console.error("Error in PUT /products/:id:", error);
      res.status(500).json({ error: error.message || "An unknown error occurred." });
    }
  };
  
  // **DELETE A PRODUCT**
  export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
  ): Promise<void> => {
    try {
      const productService = getProductService(req);
      if (!productService) {
        res.status(500).json({ error: "DesignedProduct service could not be resolved." });
        return;
      }
  
      const productId = req.params.id;
      const product = await productService.retrieve(productId);
  
      if (!product) {
        res.status(404).json({ error: "Product not found." });
        return;
      }
      await productService.delete(productId);

      res.status(200).json({ message: "Product and associated image deleted successfully." });
    } catch (error) {
      console.error("Error in DELETE /products/:id:", error);
      res.status(500).json({ error: error.message || "An unknown error occurred." });
    }
  };
  