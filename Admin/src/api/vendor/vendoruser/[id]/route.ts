import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import VendorUserService from "../../../../services/vendoruser";

const getVendorUserService = (req: MedusaRequest): VendorUserService | null => {
  try {
    return req.scope.resolve("vendoruserService") as VendorUserService;
  } catch (error) {
    console.error("Failed to resolve vendoruserService:", error);
    return null;
  }
};

// Update a specific product
export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const vendoruserService = getVendorUserService(req);
    if (!vendoruserService) {
      res
        .status(500)
        .json({ error: "Vendor User service could not be resolved." });
      return;
    }

    const userId = req.params.id;
    const updateData = req.body;

    const updatedUser = await vendoruserService.updateUser(userId, updateData);

    res
      .status(200)
      .json({
        message: "vendor user updated successfully.",
        user: updatedUser,
      });
  } catch (error) {
    console.error("Error in PUT /vendor/vendoruser/id:", error);
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
    const vendoruserService = getVendorUserService(req as any);
    if (!vendoruserService) {
      res
        .status(500)
        .json({ error: "Vendor User service could not be resolved." });
      return;
    }

    const userId = req.params.id;

    // First check if the store exists
    try {
      await vendoruserService.retrieve(userId);
    } catch (error) {
      res.status(404).json({ error: "Vendor User not found", message: "Vendor User not found" });
      return;
    }

    // Delete the store
    await vendoruserService.delete(userId);

    // Return success response
    res.status(200).json({ message: "Vendor User deleted successfully." });
  } catch (error) {
    console.error("Error during Vendor deletion:", error);
    res.status(500).json({
      error: error.message || "Failed to delete Vendor user",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
