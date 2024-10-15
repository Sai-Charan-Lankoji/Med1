import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import ProductService from "../../../../../services/product";

const getProductService = (req: MedusaRequest): ProductService | null => {
  try {
    return req.scope.resolve("productService") as ProductService;
  } catch (error) {
    console.error("Failed to resolve productService:", error);
    return null;
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
    if (!imageUrl) {
      res.status(404).json({ error: "Image not found" });
      return;
    }

    const imageName = path.basename(imageUrl); // Extract image name from URL

    // Path where the image is stored (adjust this path if necessary)
    const filePath = path.join(__dirname, "../../../../../../../uploads/", imageName);

    // Check if the image file exists and delete it
    if (fs.existsSync(filePath)) {
      await unlinkAsync(filePath);
      console.log(`Image file ${imageName} deleted successfully`);
    }

    // Set the product's thumbnail to null and update the product in the database
    product.thumbnail = null;
    await productService.update(productId, { thumbnail: null });

    res.status(200).json({ message: "Image deleted and thumbnail set to null." });
  } catch (error) {
    console.error("Error during image deletion:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};