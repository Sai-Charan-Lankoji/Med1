import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CustomerService from "../../../services/customer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import VendorService from "../../../services/vendor";
import { BusinessModel } from "../../../models/vendor";

 


const getCustomerService = (req: MedusaRequest): CustomerService | null => {
  try {
    return req.scope.resolve("customerService") as CustomerService;
  } catch (error) {
    console.error("Failed to resolve customerService:", error);
    return null;
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  try {
    const customerService = getCustomerService(req);
    if (!customerService ) {
      res.status(500).json({ error: "Services could not be resolved." });
      return;
    }

    const { email, password, first_name, last_name, phone, has_account, vendor_id } = req.body as {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone: string;
      has_account: boolean;
      vendor_id: string;  
    };

    // Ensure all required fields are present
    if (!email || !password || !first_name || !last_name || !phone || !has_account || !vendor_id) {
      res.status(400).json({ error: "All fields (email, password, first name, last name, phone, has_account, vendor_id) are required." });
      return;
    }

    // Hash the customer's password
    const password_hash = await bcrypt.hash(password, 10);

    // Create the new customer with vendor_id and API key
    const newCustomer = await customerService.create({
      email,
      password_hash,
      first_name,
      last_name,
      phone,
      has_account,
      vendor_id
    });

    // Generate JWT token
    const token = jwt.sign({ id: newCustomer.id, email: newCustomer.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Set the token in an HTTP-only cookie
    res.setHeader('Set-Cookie', `customer_token=${token}; Path=/; HttpOnly; SameSite=Strict;`);

    // Respond with the token, customer, and the API key
    res.status(201).json({
      token,
      customer: {
        ...newCustomer
      },
    });
  } catch (error) {
    console.error("Error in POST /customer/signup:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};
