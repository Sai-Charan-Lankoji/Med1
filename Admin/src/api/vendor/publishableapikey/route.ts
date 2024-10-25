import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PublishableApiKeyService from "../../../services/publishableapikey";
import { ILike } from 'typeorm';

const getPublishableApiKeyService = (req: MedusaRequest) => {
  try {
    return req.scope.resolve("publishableApiKeyService") as PublishableApiKeyService;
  } catch (error) {
    console.error("Failed to resolve PublishableApiKeyService:", error);
    return null;
  }
};
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const publishableApiKeyService = getPublishableApiKeyService(req);
    if (!publishableApiKeyService) {
      console.error("PublishableApiKeyService could not be resolved.");
      res.status(500).json({ error: "PublishableApiKeyService could not be resolved." });
      return;
    }
    const selector = { title: ILike('%') };
    const publishableApiKeys = await publishableApiKeyService.list(selector);
    res.status(200).json(publishableApiKeys);
  } catch (error) {
    console.error("Error in GET /publishableapikeys:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};
 