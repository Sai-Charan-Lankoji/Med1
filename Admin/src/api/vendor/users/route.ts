import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { ILike } from 'typeorm';
import UserService from "../../../services/user";
export declare enum UserRoles {
  ADMIN = "admin",
  MEMBER = "member",
  DEVELOPER = "developer"
}
interface UserFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRoles
  vendorId: string
  storeId: string
}
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
    const vendorId = req.query.id as string;
    const users = await userService.retrieveByVendor(vendorId);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in GET /users:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};
 

export const POST = async (
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

    // Extract user data from request body
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      vendorId,
      storeId
    } = req.body as UserFormData;

    // Validate required fields
    if (!email || !password || !role || !vendorId || !storeId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Create user object
    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      role,
      vendor_id: vendorId,
      store_id: storeId
    };

    // Call userService to create the user
    const createdUser = await userService.create(newUser,password);

    // Return the created user
    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error in POST /users:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};