import type { MedusaRequest, MedusaResponse, 
  
} from "@medusajs/medusa";
import StoreService from "../../../../services/store";
import PublishableApiKeyService from "../../../../services/publishableapikey";
import SalesChannelService from "../../../../services/salesChannel";
 
const getStoreService = (req: MedusaRequest): StoreService | null => {
  try {
    // Use the correct casing when resolving the service
    return req.scope.resolve("storeService") as StoreService;
  } catch (error) {
    console.error("Failed to resolve storeService:", error);
    return null;
  }
}

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
    null;
  }
};
//Retrive a specific product
export const GET = async (
 req: MedusaRequest,
 res: MedusaResponse
): Promise<void> => {
 try {
   const storeservice = getStoreService(req as any);
   if (!storeservice) {
     res.status(500).json({ error: "Store service could not be resolved." });
     return;
   }

   const storeId = req.params.id as string;

   if (!storeId) {
     res.status(400).json({ error: "Store ID is required." });
     return;
   }

   const store = await storeservice.retrieveByStoreId(storeId);

   if (!store) {
     res.status(404).json({ error: "Store not found." });
   }else{
     res.status(200).json({ message: "Store retrieve successfully.", store: store });
   }
 } catch (error) {
   console.error("Error in GET /store:", error);
   res.status(500).json({ error: error.message || "An unknown error occurred." });
 }
};

// Update a specific product




export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const storeService = getStoreService(req as any);
    const salesChannelService = getSalesChannelService(req);
    const publishableapikeyService = getPublishableApiKeyService(req);
    if (!storeService) {
      res.status(500).json({ error: "Store service could not be resolved." });
      return;
    }
    if (!salesChannelService || !publishableapikeyService) {
      console.error("Store service or publishableapikeyservice could not be resolved.");
      res.status(500).json({ error: "Store service or publishableapikeyservice could not be resolved." });
      return;
    }

    const storeId = req.params.id;
    
    // First retrieve the store to check existence and get associated entities
    let store;
    try {
      store = await storeService.retrieveByStoreId(storeId);
    } catch (error) {
      res.status(404).json({ error: "Store not found" });
      return;
    }

    const deletedPublishableapikey = await publishableapikeyService.delete(store.publishableapikey)
    // Delete the store and its associated entities
    await storeService.delete(storeId);
    const deletedSalesChannel = await salesChannelService.delete(store.default_sales_channel_id)


    // Return success response with details about what was deleted
    res.status(200).json({ 
      message: "Store and associated entities deleted successfully",
      details: {
        storeId: storeId,
        deletedEntities: {
          store: true,
          salesChannel: store.default_sales_channel_id ? true : false,
          publishableApiKey: store.publishableapikey ? true : false
        }
      }
    });
  } catch (error) {
    console.error("Error during store deletion:", error);
    
    // // Enhanced error response
    // const errorResponse = {
    //   error: error.message || "Failed to delete store",
    //   details: error.details || null, // In case the service provides detailed error info
    //   code: error.code || 'DELETION_ERROR'
    // };

    // // Only include stack trace in development
    // if (process.env.NODE_ENV === 'development') {
    //   errorResponse['stack'] = error.stack;
    // }

    res.status(500).json(error);
  }
};;



