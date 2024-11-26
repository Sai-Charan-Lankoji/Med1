import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CustomerService from "../../../services/customer";
import VendorService from "../../../services/vendor";
import PublishableApiKeyService from "../../../services/publishableapikey"; // Import the PublishableApiKeyService
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApparelDesign } from "../../../models/apparelDesign";
import { BusinessModel } from "../../../models/vendor";

const getCustomerService = (req: MedusaRequest): CustomerService | null => {
  try {
    return req.scope.resolve("customerService") as CustomerService;
  } catch (error) {
    console.error("Failed to resolve customerService:", error);
    return null;
  }
};

const getVendorService = (req: MedusaRequest): VendorService | null => {
  try {
    return req.scope.resolve("vendorService") as VendorService;
  } catch (error) {
    console.error("Failed to resolve vendorService:", error);
    return null;
  }
};

const getPublishableApiKeyService = (req: MedusaRequest): PublishableApiKeyService | null => {
  try {
    return req.scope.resolve("publishableApiKeyService") as PublishableApiKeyService;
  } catch (error) {
    console.error("Failed to resolve publishableApiKeyService:", error);
    return null;
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  try {
    const customerService = getCustomerService(req);
    const vendorService = getVendorService(req);
    const publishableApiKeyService = getPublishableApiKeyService(req); // Get PublishableApiKeyService

    if (!customerService || !vendorService || !publishableApiKeyService) {
      res.status(500).json({ error: "Services could not be resolved." });
      return;
    }

    const { email, password, vendorId } = req.body as { email: string; password: string; vendorId: any};

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required.",
        message: "Please enter the email and password."
       });
      return;
    }

    const existingCustomer = await customerService.checkCustomerExists({ email });

    if (!existingCustomer) {
      res.status(404).json({ error: "Customer not found.", message: "Please enter the email and password." });
      return;
    } 

    if (!existingCustomer.password_hash) {
      res.status(500).json({ error: "Password hash is missing in the customer record.",
        message: "Please enter a valid existing password."

       });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, existingCustomer.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password.", message: "Please enter a valid password." });
      return;
    }

    // Check vendor association
    const vendor = await vendorService.findByBussinessType(BusinessModel.FootballFranchise);
    if (!vendor) {
      res.status(404).json({ error: "Vendor not found.", message: "Vendor not found." });
      return;
    }

    // Function to check if customer is associated with vendor
    const isAssociatedWithVendor = await customerService.checkCustomerVendorAssociation(existingCustomer.id, vendorId);

    if (!isAssociatedWithVendor) {
      // If not associated, return a message to register first
      res.status(403).json({
        error: "Customer is not associated with the vendor.",
        message: "Please register with the store first."
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: existingCustomer.id, email: existingCustomer.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Create or get the publishable API key
    const publishableApiKey = await publishableApiKeyService.create(vendor.id, { title: "New API Key" });

    res.setHeader('Set-Cookie', `customer_token=${token}; Path=/; HttpOnly; SameSite=Strict;`);
    res.status(200).json({
      token,
      customer: existingCustomer,
      vendor: vendor,
      publishable_api_key: publishableApiKey.id // Include the API key in the response
    });
  } catch (error) {
    console.error("Error in POST /customer/login:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

