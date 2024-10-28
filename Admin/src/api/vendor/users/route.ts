import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { ILike } from 'typeorm';
import UserService from "../../../services/user";

const getUserService = (req: MedusaRequest) => {
  try {
    return req.scope.resolve("userService") as UserService;
  } catch (error) {
    console.error("Failed to resolve UserService:", error);
    return null;
  }
};
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const userService = getUserService(req);
    if (!userService) {
      console.error("UserService could not be resolved.");
      res.status(500).json({ error: "UserService could not be resolved." });
      return;
    }
    const selector = req.query.id as string;
    const users = await userService.retrieve(selector);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in GET /users:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};
 