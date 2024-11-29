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

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const planService = getPlanService(req);
    if (!planService) {
      res.status(500).json({ error: "Plan service could not be resolved." });
      return;
    }

    // Extract the data from the request body
    const newPlanData = req.body as any;

    // Call the plan service's create method
    const newPlan = await planService.create(newPlanData as any);

    res.status(201).json({ plan: newPlan });
  } catch (error) {
    console.error("Error in POST /admin/plan:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
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
    const allPlans = await planService.list();
    res.status(201).json(allPlans);
  } catch (error) {
    console.error("Error in GET /admin/plan:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};

