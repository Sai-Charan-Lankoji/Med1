import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PublishableApiKeyService from "../../../services/publishableapikey";

const getPublishableApiKeyService = (req: MedusaRequest) => {
  try {
    return req.scope.resolve("publishableApiKeyService") as PublishableApiKeyService;
  } catch (error) {
    console.error("Failed to resolve PublishableApiKeyService:", error);
    return null;
  }
};

 

// POST route to create a new publishable API key
// export const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
//   try {
//     const publishableApiKeyService = getPublishableApiKeyService(req);
    
//     if (!publishableApiKeyService) {
//       res.status(500).json({ error: "Publishable API Key service could not be resolved." });
//       return;
//     }

//     const { salesChannelId, keyData } = req.body;

//     if (!salesChannelId || !keyData) {
//       res.status(400).json({ error: "Sales channel ID and key data are required." });
//       return;
//     }

//     // Create a new API key
//     const newApiKey = await publishableApiKeyService.create(salesChannelId, keyData);
    
//     res.status(201).json({ status: "success", apiKey: newApiKey });
//   } catch (error) {
//     console.error("Error in POST /vendor/publishable-api-keys:", error);
//     res.status(500).json({ error: error.message || "An unknown error occurred." });
//   }
// };
