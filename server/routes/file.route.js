// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const { 
  upload, 
  uploadFile, 
  deleteFile, 
  listFiles, 
  getFileInfo 
} = require('../controllers/file.controller');

/**
 * @swagger
 * /api/files:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: File to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file received
 *       500:
 *         description: Server error
 * 
 *   get:
 *     summary: List all files
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: List of files
 *       500:
 *         description: Server error
 * 
 * /api/uploads/{filename}:
 *   get:
 *     summary: Get file information
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File information
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 * 
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 *       500:
 *         description: Server error
 */
router.post('/files', upload.single('file'), uploadFile);
router.get('/files', listFiles);
router.get('/uploads/:filename', getFileInfo);
router.delete('/files/:filename', deleteFile);

module.exports = router;