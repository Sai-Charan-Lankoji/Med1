import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import VendorService from "../../../../services/vendor";

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
  
      const { vendor, vendorAddress, registrationAddress  } = await vendorService.retrieve(req.params.id);
      if (!vendor) {
        res.status(200).json({ message: "No vendor found."});
      } else {
        res.status(200).json({ vendor, vendorAddress, registrationAddress });
      }
    } catch (error) {
      console.error("Error in GET /vendors:", error);
      res.status(500).json({ error: error.message || "An unknown error occurred." });
    }
  };
  

  
  export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
  ): Promise<void> => {
    try {
      const vendorService = getVendorService(req);
      if (!vendorService) {
        res.status(500).json({ error: "Vendor service could not be resolved." });
        return;
      }
  
      const vendorId = req.params.id;
      const updateData = req.body;
  
      const updatedVendor = await vendorService.update(vendorId, updateData);
  
      res.status(200).json({ message: "Vendor updated successfully.", vendor: updatedVendor });
    } catch (error) {
      console.error("Error in PUT /vendors/:id:", error);
      res.status(500).json({ error: error.message || "An unknown error occurred." });
    }
  };
  



  export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
  ): Promise<void> => {
    try {
      const vendorService = getVendorService(req);
      if (!vendorService) {
        res.status(500).json({ error: "Vendor service could not be resolved." });
        return;
      }
      
      const vendorId = req.params.id;
  
      await vendorService.delete(vendorId);
  
      res.status(200).json({ message: "Vendor and associated user deleted successfully." });
    } catch (error) {
      console.error("Error in DELETE /vendors/:id:", error);
      res.status(500).json({ error: error.message || "An unknown error occurred." });
    }
  };