const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

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

  generateUniqueFilename(originalFilename) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedFilename = this.sanitizeFilename(originalFilename.replace(/\.[^/.]+$/, ""));
    const fileExtension = path.extname(originalFilename);
    return `${sanitizedFilename}-${uniqueSuffix}${fileExtension}`;
  }

  async saveBase64File(base64String, req) {
    await this.createUploadDirectory();

    // Generate a unique filename
    const filename = `image-${Date.now()}.png`;
    const filepath = path.join(this.uploadDir, filename);

    // Decode and save the base64 string as a file
    const buffer = Buffer.from(base64String, "base64");
    await fs.writeFile(filepath, buffer);

    // Generate the file URL and relative path
    const fileUrl = this.generateFileUrl(req, filename);
    const relativePath = `/uploads/${filename}`;
    
    return { 
      filename, 
      url: fileUrl,
      relativePath 
    };
  }

  async saveFile(file) {
    await this.createUploadDirectory();

    const filename = this.generateUniqueFilename(file.originalname);
    const filepath = path.join(this.uploadDir, filename);

    await fs.writeFile(filepath, file.buffer);

    return {
      filename,
      filepath,
      relativePath: `/uploads/${filename}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  generateFileUrl(req, filename) {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = req.get('host');
    return `${protocol}://${host}/uploads/${filename}`;
  }

  generateRelativePath(filename) {
    return `/uploads/${filename}`;
  }

  async deleteFile(filename) {
    const sanitizedFilename = this.sanitizeFilename(filename);
    const filepath = path.resolve(this.uploadDir, sanitizedFilename);

    // Verify the file path is within the upload directory
    if (!filepath.startsWith(this.uploadDir)) {
      throw new Error('Invalid file path');
    }

    try {
      await fs.unlink(filepath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async getFileInfo(filename) {
    const sanitizedFilename = this.sanitizeFilename(filename);
    const filepath = path.resolve(this.uploadDir, sanitizedFilename);

    // Verify the file path is within the upload directory
    if (!filepath.startsWith(this.uploadDir)) {
      throw new Error('Invalid file path');
    }

    try {
      const stats = await fs.stat(filepath);
      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    } catch (error) {
      return null;
    }
  }

  validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      throw new Error('File size exceeds the limit of 5MB');
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('File type not allowed');
    }

    return true;
  }

  async listFiles() {
    try {
      const files = await fs.readdir(this.uploadDir);
      const fileInfoPromises = files.map((filename) => this.getFileInfo(filename));
      const fileInfos = await Promise.all(fileInfoPromises);
      return fileInfos.filter((info) => info !== null);
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }
}

module.exports = FileService;
