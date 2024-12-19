// services/fileService.js
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

  generateUniqueFilename(originalFilename) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = originalFilename.replace(/\.[^/.]+$/, "");
    const fileExtension = path.extname(originalFilename);
    return `${originalName}-${uniqueSuffix}${fileExtension}`;
  }

  async saveFile(file) {
    await this.createUploadDirectory();

    const filename = this.generateUniqueFilename(file.originalname);
    const filepath = path.join(this.uploadDir, filename);
    
    await fs.writeFile(filepath, file.buffer);
    
    return {
      filename,
      filepath,
      size: file.size,
      mimetype: file.mimetype
    };
  }

  generateFileUrl(req, filename) {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = req.get('host');
    return `${protocol}://${host}/uploads/${filename}`;
  }

  async deleteFile(filename) {
    try {
      const filepath = path.join(this.uploadDir, filename);
      await fs.unlink(filepath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async getFileInfo(filename) {
    try {
      const filepath = path.join(this.uploadDir, filename);
      const stats = await fs.stat(filepath);
      return {
        filename,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    } catch (error) {
      return null;
    }
  }

  validateFile(file) {
    // Add your file validation logic here
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
      const fileInfoPromises = files.map(filename => this.getFileInfo(filename));
      const fileInfos = await Promise.all(fileInfoPromises);
      return fileInfos.filter(info => info !== null);
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }
}

module.exports = FileService;