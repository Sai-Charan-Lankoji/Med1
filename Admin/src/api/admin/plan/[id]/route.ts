import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PlanService from "../../../../services/plan";

const getPlanService = (req: MedusaRequest): PlanService | null => {
  try {
    return req.scope.resolve("planService") as PlanService;
  } catch (error) {
    console.error("Failed to resolve planService:", error);
    return null;
  }
};

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

    const plan = await planService.retrieve(req.params.id);
    if (!plan) {
      res.status(200).json({ message: "No plan found."});
    } else {
      res.status(200).json({ plan });
    }
  } catch (error) {
    console.error("Error in GET /admin/plan/:id:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const planService = getPlanService(req);
    if (!planService) {
      res.status(500).json({ error: "Plan service could not be resolved." });
      return;
    }

    const { id } = req.params;
    const updateData = req.body;

    const updatedPlan = await planService.update(id, updateData);

    res.status(200).json({ plan: updatedPlan });
  } catch (error) {
    console.error("Error in PUT /admin/plan/[id]:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};

export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const planService = getPlanService(req);
    if (!planService) {
      res.status(500).json({ error: "Plan service could not be resolved." });
      return;
    }

    const { id } = req.params;

    await planService.delete(id);

    res.status(204).end();
  } catch (error) {
    console.error("Error in DELETE /admin/plan/[id]:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};

