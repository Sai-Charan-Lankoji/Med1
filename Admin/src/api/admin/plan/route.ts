import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import PlanService from "../../../services/plan";

// Ensure these types match your existing type definitions
export interface Plan {
  id?: string;
  name: string;
  description?: string;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreatePlanData = Pick<
  Plan,
  | "name"
  | "description"
  | "price"
  | "features"
  | "isActive"
>;

const getPlanService = (req: MedusaRequest): PlanService | null => {
    try {
      return req.scope.resolve("PlanService") as PlanService;
    } catch (error) {
      console.error("Failed to resolve PlanService:", error);
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
      console.error("Plan service could not be resolved.");
      res.status(500).json({ error: "Plan service could not be resolved." });
      return;
    }

    // Extract the data from the request body
    const newPlanData = req.body as Pick<
      Plan,
      | "name"
      | "description"
      | "price"
      | "features"
      | "isActive"
    >;

    // Validate required fields
    if (!newPlanData || !newPlanData.name || newPlanData.price === undefined) {
      console.error("Invalid request body:", req.body);
      res.status(400).json({ message: "Invalid request body. Required fields are missing." });
      return;
    }

    // Validate price and discount
    if (newPlanData.price < 0) {
      res.status(400).json({ message: "Price cannot be negative." });
      return;
    }

    // Ensure features is an array
    if (!Array.isArray(newPlanData.features) || newPlanData.features.length === 0) {
      res.status(400).json({ message: "At least one feature is required." });
      return;
    }


    // Call the plan service's create method
    const newPlan = await planService.create({
      ...newPlanData,
      isActive: newPlanData.isActive ?? true, 
    });

    res.status(201).json({ newPlan });
  } catch (error) {
    console.error("Error in POST /create-plan:", error);
    
    // Handle unique constraint violations or other specific errors
    if (error.code === '23505') { // Postgres unique constraint violation
      res.status(409).json({ error: "A plan with this name already exists." });
      return;
    }

    res.status(500).json({ 
      error: error.message || "An unknown error occurred while creating the plan.",
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};