import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductService from '../../../../services/product';
import { promisify } from "util";
import fs from "fs";
import path from "path";

const getProductService = (req: MedusaRequest): ProductService | null => {
  try {
    return req.scope.resolve("productService") as ProductService;
  } catch (error) {
    console.error("Failed to resolve productService:", error);
    return null;
  }
};

//Retrive a specific product
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const productService = getProductService(req as any);
    if (!productService) {
      res.status(500).json({ error: "Product service could not be resolved." });
      return;
    }

    const productId = req.params.id as string;

    if (!productId) {
      res.status(400).json({ error: "Product ID is required." });
      return;
    }

    const products = await productService.retrieve(productId);

    if (!products) {
      res.status(404).json({ error: "Product not found." });
    }else{
      res.status(200).json({ message: "Product retrieve successfully.", products: products });
    }
  } catch (error) {
    console.error("Error in GET /products:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

// Update a specific product
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
    

    res.status(200).json({ message: "Product updated successfully.", product: updatedProduct });
  } catch (error) {
    console.error("Error in PUT /products/:id:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

const unlinkAsync = promisify(fs.unlink);


export const DELETE = async (
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
    const product = await productService.retrieve(productId);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const imageUrl = product.thumbnail;
    const imageName = path.basename(imageUrl); // Extract image name from URL

    // Delete the product from the database
    await productService.delete(productId);

    // Path where the image is stored (adjust this path if necessary)
    const filePath = path.join(__dirname, "../../../../../../uploads/", imageName);

    // Check if the image file exists and delete it
    if (fs.existsSync(filePath)) {
      await unlinkAsync(filePath);
      console.log(`Image file ${imageName} deleted successfully`);
    } else {
      console.log("Image file does not exist, skipping deletion");
    }

    // Return success response
    res.status(200).json({ message: "Product and associated image deleted successfully." });
  } catch (error) {
    console.error("Error during product deletion:", error);
    res.status(500).json({ error: "Failed to delete product and image" });
  }
};



