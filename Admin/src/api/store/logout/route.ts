import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  try {
    res.setHeader(
      "Set-Cookie", 
      `customer_token=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`
    );
    
    res.status(200).json({ message: "Successfully logged out." });
  } catch (error) {
    console.error("Error in POST /customer/logout:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred during logout." });
  }
};
