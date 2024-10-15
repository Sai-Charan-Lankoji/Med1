import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ApparelUploadService from "../../../services/apparelUpload"; // Adjust the import path based on your structure



type CreateApparelUploadInput = {
  url: string;
  apparelDesign_id?: string;
};

// API handler for Apparel Uploads
export const POST = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  try {
    const apparelUploadService: ApparelUploadService = req.scope.resolve("apparelUploadService");
    
    // Get the upload object from the request body
    const uploadObject = req.body as CreateApparelUploadInput;
    // Create a new apparel upload record
    const newUpload = await apparelUploadService.create(uploadObject);

    res.status(201).json({
      message: "Apparel upload created successfully",
      upload: newUpload,
    });
  } catch (error) {
    console.error("Error creating apparel upload:", error);
    res.status(400).json({ error: error.message });
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse): Promise<void> => {
  try {
    const apparelUploadService: ApparelUploadService = req.scope.resolve("apparelUploadService");

    // Check if an ID is provided to retrieve a specific upload
    const { id } = req.query;

    if (id) {
      // If an ID is provided, retrieve that upload
      const upload = await apparelUploadService.retrieve(id as string);
      res.status(200).json(upload);
    } else {
      // If no ID, list all uploads
      const uploads = await apparelUploadService.list({});
      res.status(200).json(uploads);
    }
  } catch (error) {
    console.error("Error retrieving apparel upload:", error);
    res.status(400).json({ error: error.message });
  }
};
