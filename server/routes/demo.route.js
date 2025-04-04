// server/routes/demo.route.js
const express = require('express');
const router = express.Router();
const DemoRequestController = require('../controllers/demo.controller.js');


// Public route - No authentication needed
router.post('/', DemoRequestController.createDemoRequest);

router.get('/',  DemoRequestController.getAllDemoRequests);
router.get('/:id',  DemoRequestController.getDemoRequestById);
router.put('/:id', DemoRequestController.updateDemoRequest);
router.patch('/:id',  DemoRequestController.updateStatus);
router.delete('/:id', DemoRequestController.deleteDemoRequest);

module.exports = router;