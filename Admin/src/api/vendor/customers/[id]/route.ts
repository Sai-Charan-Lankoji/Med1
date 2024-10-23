import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CustomerService from "../../../../services/customer";

interface CustomerData {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: number;
  vendor_id: string;
}

// Function to get the CustomerService from the request context
const getCustomerService = (req: MedusaRequest): CustomerService | null => {
  try {
    return req.scope.resolve("customerService") as CustomerService;
  } catch (error) {
    console.error("Failed to resolve Customer Service:", error);
    return null;
  }
};

// GET function to retrieve customers for a vendor, by email, or by customer ID
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

    const customer_id = req.params.id as string | undefined;
    console.log("Customer Id: Backend customer service", customer_id);
    let customers;

    // Fetch customer by customer_id if provided
    if (customer_id) {
      customers = await customerService.retrieve(customer_id);
      if (!customers) {
        console.log(`No customer found with ID: ${customer_id}`);
        res.status(404).json({ error: "No customer found with this ID." });
        return;
      }
    } 
     else {
      res.status(400).json({ error: "No valid query parameters provided." });
      return;
    }

    // Return the customer(s)
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error in GET /customers:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};
