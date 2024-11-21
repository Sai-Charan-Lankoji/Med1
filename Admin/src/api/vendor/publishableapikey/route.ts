import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PublishableApiKeyService from "../../../services/publishableapikey";
import { ILike } from "typeorm/find-options/operator/ILike";

interface PublishableApiKeyRequestBody {
  salesChannelId: string;
  keyData: Partial<{
    title: string;
    created_by: string;
    revoked_by: string;
  }>;
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

 

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const publishableApiKeyService = getPublishableApiKeyService(req);
    if (!publishableApiKeyService) {
      res.status(500).json({ error: "Publishable API Key service could not be resolved." });
      return;
    }

    const { salesChannelId, keyData } = req.body as PublishableApiKeyRequestBody;

    if (!salesChannelId || !keyData || !keyData.title) {
      res.status(400).json({ error: "Sales channel ID and key data with title are required." });
      return;
    }

    const newApiKey = await publishableApiKeyService.create(salesChannelId, keyData);

    res.status(201).json(newApiKey);
  } catch (error) {
    console.error("Error in POST /vendor/publishable-api-keys:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};
