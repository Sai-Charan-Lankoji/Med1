import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ApparelDesignService from '../../../services/apparelDesign'; 

type CreateApparelDesign = {
    design: object;
    thumbnail_images?: string | null;
    isActive?: string;
    archive?: string;
    customer_id?: string;
};

const getApparelDesignService = (req: MedusaRequest): ApparelDesignService | null => {
  try {
    return req.scope.resolve("apparelDesignService") as ApparelDesignService;
  } catch (error) {
    console.error("Failed to resolve apparelDesignService:", error);
    return null;
  }
};

// GET method to retrieve all apparel designs or filter by vendor/customer
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const apparelDesignService = getApparelDesignService(req);
    if (!apparelDesignService) {
      res.status(500).json({ error: "Apparel Design service could not be resolved." });
      return;
    }

    const { vendor_id, customer_id } = req.query;

    const selector = {
      ...(vendor_id && { vendor_id: vendor_id as string }),
      ...(customer_id && { customer_id: customer_id as string }),
    };

    const designs = await apparelDesignService.list(selector);

    res.status(200).json({ designs });
  } catch (error) {
    console.error("Error in GET /apparel-designs:", error);
    res.status(500).json({ error: error.message || "An unknown error occurred." });
  }
};

// POST method to create a new apparel design
export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ): Promise<void> => {
    try {
      const apparelDesignService = getApparelDesignService(req);
      if (!apparelDesignService) {
        res.status(500).json({ error: "Apparel Design service could not be resolved." });
        return;
      }
  
      const { design, thumbnail_images, isActive, archive, customer_id } = req.body as CreateApparelDesign;
      // if (!vendor_id) {
      //   res.status(400).json({ error: "Vendor ID is required to create an apparel design." });
      //   return;
      // }
  
      if (!customer_id) {
        res.status(400).json({ error: "Customer ID is required to create an apparel design.", message: "Customer ID is required to create an apparel design." });
        return;
      }
  
      const newDesign = await apparelDesignService.create({
        design,
        thumbnail_images,
        isActive,
        archive,
        customer_id,
      });
      res.status(201).json({ newDesign });
    } catch (error) {
      console.error("Error in POST /apparel-design:", error);
      res.status(500).json({ error: error.message });
    }
  };