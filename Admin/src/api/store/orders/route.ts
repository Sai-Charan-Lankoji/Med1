import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import OrderService from "../../../services/order";
import { writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

interface OrderData {
  status: string;
  fulfillment_status: string;
  payment_status: string;
  customer_id: string;
  vendor_id: string;
  email: string;
  region_id: string;
  currency_code: string;
  public_api_key: string;
  line_items: {
    product_id: string;
    quantity: number;
    price: number;
    thumbnail_url: string[]; // Array of URLs
    upload_url: any;
    background_image_url: string;
    background_image_color: string;
  }[];
  total_amount: string;
}

const getOrderService = (req: MedusaRequest): OrderService | null => {
  try {
    return req.scope.resolve("orderService") as OrderService;
  } catch (error) {
    console.error("Failed to resolve orderService:", error);
    return null;
  }
};


async function processSVGtoImage(
  svgBuffer: Buffer,
  originalName: string
): Promise<string> {
  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const svgFilename = `${originalName}-${uniqueSuffix}.svg`;
    const pngFilename = `${originalName}-${uniqueSuffix}.png`;

    // Use the upload directory from Medusa config
    const uploadDir = "uploads"; // Matches the upload_dir in @medusajs/file-local config
    const svgPath = path.join(process.cwd(), uploadDir, svgFilename);
    const pngPath = path.join(process.cwd(), uploadDir, pngFilename);

    // Ensure upload directory exists
    const fs = require('fs').promises;
    await fs.mkdir(path.join(process.cwd(), uploadDir), { recursive: true });

    // Save and process files
    await writeFile(svgPath, svgBuffer);
    await sharp(svgPath)
      .png()
      .toFile(pngPath);

    // Use the appropriate host based on environment
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = process.env.HOST || "localhost:9000";
    
    return `${protocol}://${host}/${uploadDir}/${pngFilename}`;
  } catch (error) {
    console.error("Error processing SVG:", error);
    throw new Error("Failed to process SVG file");
  }
}

async function fetchAndProcessSVG(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = url.split("/").pop()?.split(".")[0] || "image";
    return await processSVGtoImage(buffer, filename);
  } catch (error) {
    console.error("Error fetching and processing SVG:", error);
    throw new Error("Failed to fetch and process SVG file");
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    console.log("Request body:", req.body);
    const orderService = getOrderService(req);
    if (!orderService) {
      console.error("Order service could not be resolved.");
      res.status(500).json({ error: "Order service could not be resolved." });
      return;
    }

    const { line_items, public_api_key, customer_id, total_amount, ...rest } =
      req.body as OrderData;

    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      console.error("Line items are missing or invalid in request body.");
      res.status(400).json({ error: "At least one line item is required." });
      return;
    }

    // Process each line item's array of thumbnail_urls
    const processedLineItems = await Promise.all(
      line_items.map(async (item) => {
        const processedItem = { ...item };
        if (
          item.thumbnail_url &&
          Array.isArray(item.thumbnail_url) &&
          item.thumbnail_url.length > 0
        ) {
          const processedThumbnails = await Promise.all(
            item.thumbnail_url.map(async (url) => {
              if (url.toLowerCase().endsWith('.svg')) {
                try {
                  return await fetchAndProcessSVG(url);
                } catch (error) {
                  console.error(
                    `Error processing SVG thumbnail for item: ${item.product_id}`,
                    error
                  );
                  return url; // Keep original URL if processing fails
                }
              }
              return url; // Return non-SVG URLs unchanged
            })
          );
          processedItem.thumbnail_url = processedThumbnails;
        }
        return processedItem;
      })
    );

    const newOrderData = {
      line_items: processedLineItems,
      public_api_key,
      customer_id,
      total_amount,
      ...rest,
    };
    const newOrder = await orderService.createOrder(newOrderData as any);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error in POST /orders:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};