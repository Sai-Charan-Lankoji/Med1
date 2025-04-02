const FileService = require('../services/file.service');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileService = new FileService();

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received.' });
    }

    // Validate file
    fileService.validateFile(req.file);

    // Save file
    const fileInfo = await fileService.saveFile(req.file);
    
    // Generate URL
    const fileUrl = fileService.generateFileUrl(req, fileInfo.filename);
    const relativePath = `/uploads/${fileInfo.filename}`; // This is the relative path

    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl, // Full URL for client-side display
      relativePath, // Relative path for DB storage
      fileInfo: {
        filename: fileInfo.filename,
        size: fileInfo.size,
        mimetype: fileInfo.mimetype
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      error: 'Error uploading file', 
      details: error.message 
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const deleted = await fileService.deleteFile(filename);

    if (!deleted) {
      return res.status(404).json({ error: 'File not found.' });
    }

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      error: 'Error deleting file', 
      details: error.message 
    });
  }
};

const listFiles = async (req, res) => {
  try {
    const files = await fileService.listFiles();
    res.status(200).json({ files });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ 
      error: 'Error listing files', 
      details: error.message 
    });
  }
};

const getFileInfo = async (req, res) => {
  try {
    const { filename } = req.params;
    const fileInfo = await fileService.getFileInfo(filename);

    if (!fileInfo) {
      return res.status(404).json({ error: 'File not found.' });
    }

    res.status(200).json({ fileInfo });
  } catch (error) {
    console.error('Error getting file info:', error);
    res.status(500).json({ 
      error: 'Error getting file info', 
      details: error.message 
    });
  }
};

module.exports = {
  upload,
  uploadFile,
  deleteFile,
  listFiles,
  getFileInfo
};