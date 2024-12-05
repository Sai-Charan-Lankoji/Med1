import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PlanService from "../../../services/plan";
import { CreatePlanData } from "../../../repositories/plan";

const getPlanService = (req: MedusaRequest): PlanService | null => {
  try {
    return req.scope.resolve("planService") as PlanService;
  } catch (error) {
    console.error("Failed to resolve planService:", error);
    return null;
  }
};

// Optionally, you can add a GET method to retrieve plans
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const planService = getPlanService(req);
    if (!planService) {
      res.status(500).json({ error: "Plan service could not be resolved." });
      return;
    }
    res.status(501).json({ message: "GET method not implemented yet" });
  } catch (error) {
    console.error("Error in GET /vendor/plan:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};

