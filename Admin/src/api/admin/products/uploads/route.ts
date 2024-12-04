import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import path from "path";
import multer from "multer";
import { promisify } from "util";

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

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    await uploadSingle(req as any, res as any);

    const fileName = (req as any).file.filename;
    const originalName = (req as any).file.originalname

    const fileUrl = `http://localhost:9000/uploads/${fileName}`;

    res.status(200).json({ fileUrl });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ error: "Image upload failed", message: "Image upload failed."});
  }
};


