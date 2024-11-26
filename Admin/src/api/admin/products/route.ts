import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductService from '../../../services/product';

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const productService = req.scope.resolve("productService") as ProductService;

    const productsWithNullVendor = await productService.retrieveByNullVendor();

    if (!productsWithNullVendor || productsWithNullVendor.length === 0) {
     res.status(404).json({ error: "No products found with null vendor_id.", message: "Product not found with null vendor_id"});
    }

    const formattedProducts = productsWithNullVendor.map((product) => ({
      id: product.id,
      created_at: product.created_at,
      title: product.title,
      handle: product.handle,
      status: product.status,
      thumbnail: product.thumbnail || null,
      collection_id: product.collection_id || null,
      variants: product.variants || [],
      options: product.options || [],
      collection: product.collection || null,
      tags: product.tags || [],
      type: product.type || null,
      images: product.images || [],
      sales_channels: product.sales_channels || [],
    }));

   
    res.status(200).json({
      products: formattedProducts,
      count: formattedProducts.length,
      offset: 0,
      limit: 15 
    });
  } catch (error) {
    console.error("Error in GET /admin/products:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};
