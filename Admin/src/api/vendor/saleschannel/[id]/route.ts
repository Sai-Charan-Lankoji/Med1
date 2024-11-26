import type { MedusaRequest, MedusaResponse, 
  
} from "@medusajs/medusa";
import SalesChannelService from "../../../../services/salesChannel";

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
   const saleschannelService = getSalesChannelService(req as any);
   if (!saleschannelService) {
     res.status(500).json({ error: "Sales Channel service could not be resolved." });
     return;
   }

   const saleschannelId = req.params.id as string;

   if (!saleschannelId) {
     res.status(400).json({ error: "Sales Channel ID is required.", message: "Sales Channel ID is required." });
     return;
   }

   const saleschannels = await saleschannelService.retrieve(saleschannelId);

   if (!saleschannels) {
     res.status(404).json({ error: "Sales Channel not found.", message: "Sales Channel not found." });
   }else{
     res.status(200).json({ message: "Sales Channel retrieve successfully.", saleschannels: saleschannels });
   }
 } catch (error) {
   console.error("Error in GET /saleschannels:", error);
   res.status(500).json({ error: error.message || "An unknown error occurred." });
 }
};

// Update a specific product
export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
 ): Promise<void> => {
  try {
    const saleschannelService = getSalesChannelService(req as any);
    if (!saleschannelService) {
      res.status(500).json({ error: "Sales Channel service could not be resolved." });
      return;
    }
 
    const updateData = req.body;
    const saleschannelId = req.params.id; 
    const updateSalesChannel = await saleschannelService.update(saleschannelId as string, updateData);
    
 
    res.status(200).json({ message: "sales channel updated successfully.", saleschannel: updateSalesChannel });
  } catch (error) {
    console.error("Error in PUT /saleschannel/:id:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
 };



export const DELETE = async (
 req: MedusaRequest,
 res: MedusaResponse
): Promise<void> => {
 try {
   const saleschannelService = getSalesChannelService(req as any);
   if (!saleschannelService) {
     res.status(500).json({ error: "Sales Channel service could not be resolved." });
     return;
   }

   const saleschannelId = req.params.id;
   const saleschannel = await saleschannelService.retrieve(saleschannelId);

   if (!saleschannel) {
     res.status(404).json({ error: "Sales Channel not found", message: "Sales Channel not found." });
     return;
   }

   // Delete the product from the database
   await saleschannelService.delete(saleschannelId);

   // Return success response
   res.status(200).json({ message: "Sales Channel deleted successfully." });
 } catch (error) {
   console.error("Error during Sales Channel deletion:", error);
   res.status(500).json({ error: "Failed to delete Sales Channel", message: "Failed to delete Sales Channel"});
 }
};



