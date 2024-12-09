import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import bcrypt from "bcryptjs";
import VendorService from "../../../services/vendor";
import VendorUserService from "../../../services/vendoruser";

const getVendorService = (req: MedusaRequest): VendorService | null => {
  try {
    return req.scope.resolve("vendorService") as VendorService;
  } catch (error) {
    console.error("Failed to resolve vendorService:", error);
    return null;
  }
};

const getVendorUserService = (req: MedusaRequest): VendorUserService | null => {
  try {
    return req.scope.resolve("vendoruserService") as VendorUserService;
  } catch (error) {
    console.error("Failed to resolve vendoruserService:", error);
    return null;
  }
};

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const vendorService = getVendorService(req);
    const vendorUserService = getVendorUserService(req);

    if (!vendorService || !vendorUserService) {
      res.status(500).json({ error: "Services could not be resolved." });
      return;
    }

    const { email, newPassword } = req.body as {
      email: string;
      newPassword: string;
    };

    if (!email || !newPassword) {
      res.status(400).json({ error: "Email and new password are required." });
      return;
    }

    // Check if email matches a Vendor
    const vendor = await vendorService.findByEmail(email);
    if (vendor) {
      // Check if new password matches the existing password
      const isPasswordSame = await bcrypt.compare(newPassword, vendor.password);
      if (isPasswordSame) {
        res.status(400).json({ error: "New password must be different from the current password." });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await vendorService.updatePassword(vendor.id, hashedPassword);

      res.status(200).json({ message: "Password reset successful for Vendor." });
      return;
    }

    // Check if email matches a VendorUser
    const vendorUser = await vendorUserService.findByEmail(email);
    if (vendorUser) {
      // Check if new password matches the existing password
      const isPasswordSame = await bcrypt.compare(newPassword, vendorUser.password);
      if (isPasswordSame) {
        res.status(400).json({ error: "New password must be different from the current password." });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await vendorUserService.updatePassword(vendorUser.id, hashedPassword);

      res.status(200).json({ message: "Password reset successful for Vendor User." });
      return;
    }

    res.status(404).json({ error: "Email not found." });
  } catch (error) {
    res.status(500).json({ error: error.message || "An error occurred." });
  }
};

export const CORS = false;

