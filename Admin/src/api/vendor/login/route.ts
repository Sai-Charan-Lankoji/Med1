import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import VendorService from "../../../services/vendor";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Vendor } from "../../../models/vendor";
import VendorUserService from "../../../services/vendoruser";
import { VendorUser } from "../../../models/vendor-user";

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

    if (!vendorService) {
      res.status(500).json({ error: "Vendor service could not be resolved." });
      return;
    }
    if (!vendorUserService) {
      res
        .status(500)
        .json({ error: "Vendor User service could not be resolved." });
      return;
    }

    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required.", message: "Please enter a valid email and password." });
      return;
    }

    // First, check if credentials match a Vendor
    const vendor: Vendor | null = await vendorService.findByEmail(email);
    const vendorUser: VendorUser | null = await vendorUserService.findByEmail(
      email
    );
    console.log("VENDOR: ",vendor)
    console.log("VENDORUSER: ", vendorUser);
    if (vendor) {
      const isVendorPasswordValid = await bcrypt.compare(password, vendor.password);
      console.log("VENDORVALIDPASSWORD: ", isVendorPasswordValid)
      if (isVendorPasswordValid) {
        // Vendor credentials matched, create and return a token
        const token = jwt.sign(
          { id: vendor.id, email: vendor.contact_email },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        );

        res.setHeader('Set-Cookie', `vendor_id=${vendor.id}; Path=/; HttpOnly; Secure; SameSite=None;`);
        res.status(200).json({ token, vendor });
        return;
      }
    }
    // If no Vendor match, check if credentials match a VendorUser
    else if (vendorUser) {
      const isVendorUserPasswordValid = await bcrypt.compare(
        password,
        vendorUser.password
      );
    console.log("ISVALIDPASSWORD: ",isVendorUserPasswordValid)
      // VendorUser credentials matched, create and return a token
      const token = jwt.sign(
        { id: vendorUser.id, email: vendorUser.email, role: vendorUser.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token, vendorUser });
      return;
    } 
    else {
      res.status(401).json({ error: "Invalid email or password.", message: "Invalid email or password." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};

export const CORS = false;
