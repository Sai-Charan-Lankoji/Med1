import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CustomerService from "../../../services/customer";

interface CustomerData {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    phone: number;
    vendor_id: string;
 }

// Function to get the OrderService from the request context
const getCustomerService = (req: MedusaRequest): CustomerService | null => {
  try {
    return req.scope.resolve("customerService") as CustomerService;
  } catch (error) {
    console.error("Failed to resolve Customer Service:", error);
    return null;
  }
};

// GET function to retrieve orders for a vendor
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const customerService = getCustomerService(req);
    if (!customerService) {
      console.error("Customer service could not be resolved.");
      res.status(500).json({ error: "Customer service could not be resolved." });
      return;
    }

    // Assuming vendor_id comes from the logged-in session or token
    const vendor_id = req.query.vendor_id as string;

    // Validate vendor ID
    if (!vendor_id) {
      console.error("Vendor ID is missing in request.");
      res.status(400).json({ error: "Vendor ID is required." });
      return;
    }

    // Fetch all orders associated with the vendor
    const customers = await customerService.getCustomersByVendorId(vendor_id); // Implement this method in OrderService

    if (!customers || customers.length === 0) {
      console.log(`No customers found for vendor ID: ${vendor_id}`);
      res.status(404).json({ error: "No customers found for this vendor." });
      return;
    }

    // Return the list of customers
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error in GET /customers:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

 