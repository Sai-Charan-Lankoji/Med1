import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import StoreService from "../../../../services/store";
import PublishableApiKeyService from "../../../../services/publishableapikey";
import SalesChannelService from "../../../../services/salesChannel";

const getStoreService = (req: MedusaRequest): StoreService | null => {
  try {
    return req.scope.resolve("storeService") as StoreService;
  } catch (error) {
    console.error("Failed to resolve storeService:", error);
    return null;
  }
};

const getPublishableApiKeyService = (
  req: MedusaRequest
): PublishableApiKeyService | null => {
  try {
    return req.scope.resolve(
      "publishableApiKeyService"
    ) as PublishableApiKeyService;
  } catch (error) {
    console.error("Failed to resolve publishableApiKeyService:", error);
    return null;
  }
};

const getSalesChannelService = (
  req: MedusaRequest
): SalesChannelService | null => {
  try {
    return req.scope.resolve("salesChannelService") as SalesChannelService;
  } catch (error) {
    console.error("Failed to resolve salesChannelService:", error);
    return null;
  }
};

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const storeService = getStoreService(req as any);
    if (!storeService) {
      res.status(500).json({ error: "Store service could not be resolved." });
      return;
    }

    const storeId = req.params.id as string;

    if (!storeId) {
      res.status(400).json({
        error: "Store ID is required.",
        message: "Store ID is required.",
      });
      return;
    }

    const store = await storeService.retrieveByStoreId(storeId);

    if (!store) {
      res.status(404).json({ error: "Store not found." });
    } else {
      res.status(200).json({ message: "Store retrieved successfully.", store: store });
    }
  } catch (error) {
    console.error("Error in GET /store:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const storeService = getStoreService(req as any);
    if (!storeService) {
      res.status(500).json({ error: "Store service could not be resolved." });
      return;
    }

    const updateData = req.body;
    const storeId = req.params.id;
    const updatedStore = await storeService.updateStore(
      storeId as string,
      updateData
    );

    res.status(200).json({ message: "Store updated successfully.", store: updatedStore });
  } catch (error) {
    console.error("Error in PUT /vendor/store/id:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const storeService = getStoreService(req as any);
    const salesChannelService = getSalesChannelService(req);
    const publishableApiKeyService = getPublishableApiKeyService(req);
    if (!storeService || !salesChannelService || !publishableApiKeyService) {
      res.status(500).json({ error: "Required services could not be resolved." });
      return;
    }

    const storeId = req.params.id;

    let store;
    try {
      store = await storeService.retrieveByStoreId(storeId);
    } catch (error) {
      res.status(404).json({ error: "Store not found", message: "Store not found" });
      return;
    }

    const deletedPublishableApiKey = await publishableApiKeyService.delete(
      store.publishableapikey
    );
    await storeService.delete(storeId);
    const deletedSalesChannel = await salesChannelService.delete(
      store.default_sales_channel_id
    );

    res.status(200).json({
      message: "Store and associated entities deleted successfully",
      details: {
        storeId: storeId,
        deletedEntities: {
          store: true,
          salesChannel: store.default_sales_channel_id ? true : false,
          publishableApiKey: store.publishableapikey ? true : false,
        },
      },
    });
  } catch (error) {
    console.error("Error during store deletion:", error);
    res.status(500).json(error);
  }
};

