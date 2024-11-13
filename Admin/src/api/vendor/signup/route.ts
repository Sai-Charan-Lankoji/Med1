import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import VendorService from "../../../services/vendor";
import { Vendor } from "../../../models/vendor";
import { Address } from "../../../models/address";
import { User } from "../../../models/user";


const getVendorService = (req: MedusaRequest): VendorService | null => {
  try {
    return req.scope.resolve("vendorService") as VendorService;
  } catch (error) {
    console.error("Failed to resolve vendorService:", error);
    return null;
  }
};

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const vendorService = getVendorService(req);
    if (!vendorService) {
      res.status(500).json({ error: "Vendor service could not be resolved." });
      return;
    }

    const { selector } = req.query;

    if (selector) {
      const vendor = await vendorService.find({
        company_name: selector as string,
      });

      if (!vendor) {
        res.status(404).json({ message: "Vendor not found." });
      } else {
        res.status(200).json(vendor);
      }
    } else {
      const vendors = await vendorService.getAllVendors();

      if (vendors[0].length === 0) {
        res.status(200).json({ message: "No vendors found." });
      } else {
        res.status(200).json({ vendors: vendors[0], count: vendors[1] });
      }
    }
  } catch (error) {
    console.error("Error in GET /vendors:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const vendorService = getVendorService(req);
    if (!vendorService) {
      console.error("Vendor service could not be resolved.");
      res.status(500).json({ error: "Vendor service could not be resolved." });
      return;
    }

    // Extract the data from the request body
    const newVendorData = req.body as Pick<
      Vendor,
      | "company_name"
      | "contact_name"
      | "registered_number"
      | "contact_email"
      | "contact_phone_number"
      | "tax_number"
      | "business_type"
      | "password"
    > & {
      vendorAddressData?: Partial<Address>;
      registrationAddressData?: Partial<Address>;
      // userData?: Partial<User>;
    };

    // Validate required fields
    if (!newVendorData || !newVendorData.company_name || !newVendorData.contact_email || !newVendorData.password) {
      console.error("Invalid request body:", req.body);
      res.status(400).json({ error: "Invalid request body. Required fields are missing." });
      return;
    }


    // Call the vendor service's create method
    const newVendor = await vendorService.create(newVendorData);

    res.status(201).json({ newVendor });
  } catch (error) {
    console.error("Error in POST /create-vendor:", error);
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
};
