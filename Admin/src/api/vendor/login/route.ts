import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import VendorService from "../../../services/vendor";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Vendor } from "../../../models/vendor";

const getVendorService = (req: MedusaRequest): VendorService | null => {
  try {
    return req.scope.resolve("vendorService") as VendorService;
  } catch (error) {
    console.error("Failed to resolve vendorService:", error);
    return null;
  }
};

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const vendorService = getVendorService(req);
    if (!vendorService) {
      res.status(500).json({ error: "Vendor service could not be resolved." });
      return;
    }

    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const vendor: Vendor | null = await vendorService.findByEmail(email);

    if (!vendor) {
      res.status(401).json({ error: "Invalid email" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, vendor.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid  password." });
      return;
    }

    const token = jwt.sign(
      { id: vendor.id, email: vendor.contact_email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
     res.setHeader('Set-Cookie', `vendor_id=${vendor.id}; Path=/; HttpOnly; Secure; SameSite=None;`);

    res.status(200).json({ token, vendor });

  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};

export const CORS = false;