import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import SalesChannelService from "../../../services/salesChannel";
import PublishableApiKeyService from "../../../services/publishableapikey";

interface SalesChannelData {
  name: string;
  description?: string;
  is_disabled?: boolean;
  vendor_id: string;
}

const getSalesChannelService = (
  req: MedusaRequest
): SalesChannelService | null => {
  try {
    return req.scope.resolve("salesChannelService") as SalesChannelService;
  } catch (error) {
    console.error("Failed to resolve salesChannelService:", error);
    null;
  }
};

const getPublishableApiKeyService = (req: MedusaRequest): PublishableApiKeyService | null => {
  try {
    return req.scope.resolve("publishableApiKeyService") as PublishableApiKeyService;
  } catch (error) {
    console.error("Failed to resolve publishableApiKeyService:", error);
    return null;
  }
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const salesChannelService = getSalesChannelService(req);
    const publishableapikeyService = getPublishableApiKeyService(req);

    if (!salesChannelService || !publishableapikeyService) {
      console.error("Store service or publishableapikeyservice could not be resolved.");
      res.status(500).json({ error: "Store service or publishableapikeyservice could not be resolved." });
      return;
    }

    // Assuming vendor_id comes from the query parameters
    const vendor_id = req.query.vendor_id as string;

    // Validate vendor ID
    if (!vendor_id) {
      console.error("Vendor ID is missing in request.");
      res.status(400).json({ error: "Vendor ID is required." });
      return;
    }

    // Fetch all sales channels associated with the vendor
    const salesChannels = await salesChannelService.listSalesChannelsByVendor(
      vendor_id
    );

    if (!salesChannels || salesChannels.length === 0) {
      console.log(`No sales channels found for vendor ID: ${vendor_id}`);
      res
        .status(404)
        .json({ error: "No sales channels found for this vendor." });
      return;
    }

    // Return the list of sales channels
    res.status(200).json(salesChannels);
  } catch (error) {
    console.error("Error in GET /salesChannels:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    console.log("Request body:", req.body);

    const salesChannelService = getSalesChannelService(req);
    const publishableapikeyService = getPublishableApiKeyService(req);

    if (!salesChannelService || !publishableapikeyService) {
      console.error("Store service or publishableapikeyservice could not be resolved.");
      res.status(500).json({ error: "Store service or publishableapikeyservice could not be resolved." });
      return;
    }

    const { vendor_id, name } = req.body as SalesChannelData;

    if (!vendor_id) {
      console.error("Vendor ID is missing in request body.");
      res.status(400).json({ error: "Vendor ID is required." });
    }
    if (!name) {
      console.error("Sales Channel name is missing in request body.");
      res.status(400).json({ error: "Sales Channel name is required." });
    }

    const newSalesChannelData: Partial<SalesChannelData> = req.body;
    const salesChannelDataWithVendor = {
      ...newSalesChannelData,
      vendor_id,
    };

    const newSalesChannel = await salesChannelService.create(
      salesChannelDataWithVendor as any
    );

    res.status(201).json(newSalesChannel);
  } catch (error) {
    console.error("Error in POST /sales-channels:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    res.status(500).json({ error: errorMessage });
  }
};

 



