import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { VendorUser } from "../../../models/vendor-user";
import VendorUserService from "../../../services/vendoruser";
 

const getVendorUserService = (req: MedusaRequest): VendorUserService | null => {
  try {
    return req.scope.resolve("vendoruserService") as VendorUserService;
  } catch (error) {
    console.error("Failed to resolve vendoruserService:", error);
    return null;
  }
};

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const vendoruserService = getVendorUserService(req);
    if (!vendoruserService) {
      res.status(500).json({ error: "Vendor User service could not be resolved." });
      return;
    }
    const id = req.query.id as string;
    const users = await vendoruserService.retrieve(id);
    res.status(200).json(users);

  } catch (error) {
    console.error("Error in GET /vendor/vendoruser:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};

type CreateVendorUserInput = {
  email: string;
  password: string;
  first_name?: string;
  last_name: string;
  role: string;
  vendor_id?: string;
};

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const vendoruserService = getVendorUserService(req);
    if (!vendoruserService) {
      console.error("Vendor user service could not be resolved.");
      res.status(500).json({ error: "Vendor user service could not be resolved." });
      return;
    }

    // Extract the data from the request body
    const newVendorUserData = req.body as CreateVendorUserInput;
    // Call the vendor service's create method
    const newVendor = await vendoruserService.create(newVendorUserData);

    res.status(201).json({ newVendor });
  } catch (error) {
    console.error("Error in POST /vendoruser:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};
