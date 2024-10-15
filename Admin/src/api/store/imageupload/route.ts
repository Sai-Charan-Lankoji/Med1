import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import path from "path";
import multer from "multer";
import { promisify } from "util";
import fs from "fs";
import cors from "cors"; // Import CORS

// CORS configuration
const corsOptions = {
  origin: "http://localhost:8003", // Allow requests from this frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  credentials: true, // Allow credentials (cookies, etc.)
};

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save to the uploads folder
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });
const uploadSingle = promisify(upload.single("file"));

// Upload API with CORS handling
// Upload API with CORS handling
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  // Apply CORS to this specific route
  cors(corsOptions)(req, res, async () => {
    try {
      // Handle file upload
      await uploadSingle(req as any, res as any);
      const fileName = (req as any).file.filename;
      const fileUrl = `http://localhost:9000/uploads/${fileName}`;

      // Set CORS headers for the response
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:8003");
      res.setHeader("Access-Control-Allow-Credentials", "true");

      // Return the uploaded file URL
      res.status(200).json({ fileUrl });
    } catch (error) {
      console.error("Error during file upload:", error);
      res.status(500).json({ error: "Image upload failed" });
    }
  });
};


export const CORS = false; // Medusa-specific setting
