const path = require('path');
const fs = require('fs').promises;

class FileService {
  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
  }

  async createUploadDirectory() {
    try {
      await fs.access(this.uploadDir);
    } catch (error) {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
  }

  generateUniqueFilename(extension) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    return `image-${uniqueSuffix}.${extension}`;
  }

  async saveBase64File(base64String, req) {
    await this.createUploadDirectory();

    // Extract metadata and data
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split('/')[1]; // Get file extension (jpg, png, etc.)

    if (!['jpeg', 'png', 'jpg', 'gif'].includes(extension)) {
      throw new Error('Invalid image format');
    }

    const filename = this.generateUniqueFilename(extension);
    const filePath = path.join(this.uploadDir, filename);
    const buffer = Buffer.from(base64Data, 'base64');

    await fs.writeFile(filePath, buffer);

    return {
      filename,
      filePath,
      url: this.generateFileUrl(req, filename), // Return full URL
    };
  }

  generateFileUrl(req, filename) {
    const protocol = req.protocol; // Detect HTTP or HTTPS dynamically
    const host = req.get('host'); // Get the current host (localhost:5000 or domain)
    return `${protocol}://${host}/uploads/${filename}`;
  }
}

module.exports = FileService;
