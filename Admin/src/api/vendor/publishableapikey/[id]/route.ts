import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PublishableApiKeyService from "../../../../services/publishableapikey";

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

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const publishableApiKeyService = getPublishableApiKeyService(req);
    if (!publishableApiKeyService) {
      res
        .status(500)
        .json({ error: "Publishable API Key service could not be resolved." });
      return;
    }
    const id = req.params.id
    const publishableApiKeys = await publishableApiKeyService.retrieve(id);
    res.status(200).json({ status: "success", apiKeys: publishableApiKeys });
  } catch (error) {
    console.error("Error in GET /vendor/publishable-api-keys:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};
