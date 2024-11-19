import type { MedusaRequest, MedusaResponse, 
  
} from "@medusajs/medusa";
import StoreService from "../../../../services/store";
 
const getStoreService = (req: MedusaRequest): StoreService | null => {
  try {
    // Use the correct casing when resolving the service
    return req.scope.resolve("storeService") as StoreService;
  } catch (error) {
    console.error("Failed to resolve storeService:", error);
    return null;
  }
}

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

// // // Update a specific product
// // export const PUT = async (
// //  req: MedusaRequest,
// //  res: MedusaResponse
// // ): Promise<void> => {
// //  try {
// //    const storeservice = getStoreService(req as any);
// //    if (!storeservice) {
// //      res.status(500).json({ error: "Store service could not be resolved." });
// //      return;
// //    }

// //    const storeId = req.params.id;
// //    const updateData = req.body;

// //    const updateStore = await storeservice.updateStore(storeId, updateData);
   

// //    res.status(200).json({ message: "Store updated successfully.", store: updateStore });
// //  } catch (error) {
// //    console.error("Error in PUT /store/:id:", error);
// //    res.status(500).json({ error: error.message || "An unknown error occurred." });
// //  }
// // };



export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const storeService = getStoreService(req as any);
    if (!storeService) {
      res.status(500).json({ error: "Store service could not be resolved." });
      return;
    }

    const storeId = req.params.id;
    
    // First check if the store exists
    try {
      await storeService.retrieveByStoreId(storeId);
    } catch (error) {
      res.status(404).json({ error: "Store not found" });
      return;
    }

    // Delete the store
    await storeService.delete(storeId);

    // Return success response
    res.status(200).json({ message: "Store deleted successfully." });
  } catch (error) {
    console.error("Error during store deletion:", error);
    res.status(500).json({ 
      error: error.message || "Failed to delete store",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};



