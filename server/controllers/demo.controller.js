// server/controllers/demo.controller.js
const DemoRequestService = require('../services/demo.service.js');

class DemoRequestController {
  async createDemoRequest(req, res) {
    try {
      const demoRequest = await DemoRequestService.createDemoRequest(req.body);
      res.status(201).json({
        status: 201,
        success: true,
        message: "Demo request submitted successfully",
        data: demoRequest
      });
    } catch (error) {
      console.error("Error creating demo request:", error);
      res.status(400).json({
        status: 400,
        success: false,
        message: "Failed to submit demo request",
        error: { code: "VALIDATION_ERROR", details: error.message }
      });
    }
  }
  
  async getAllDemoRequests(req, res) {
    try {
      const demoRequests = await DemoRequestService.getAllDemoRequests();
      res.status(200).json({
        status: 200,
        success: true,
        message: "Demo requests retrieved successfully",
        data: demoRequests
      });
    } catch (error) {
      console.error("Error retrieving demo requests:", error);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Failed to retrieve demo requests",
        error: { code: "SERVER_ERROR", details: error.message }
      });
    }
  }
  
  async getDemoRequestById(req, res) {
    try {
      const demoRequest = await DemoRequestService.getDemoRequestById(req.params.id);
      
      // Mark as read if it wasn't already
      if (!demoRequest.read) {
        await DemoRequestService.markAsRead(req.params.id);
      }
      
      res.status(200).json({
        status: 200,
        success: true,
        message: "Demo request retrieved successfully",
        data: demoRequest
      });
    } catch (error) {
      console.error("Error retrieving demo request:", error);
      res.status(404).json({
        status: 404,
        success: false,
        message: "Failed to retrieve demo request",
        error: { code: "NOT_FOUND", details: error.message }
      });
    }
  }
  
  async updateDemoRequest(req, res) {
    try {
      const demoRequest = await DemoRequestService.updateDemoRequest(req.params.id, req.body);
      res.status(200).json({
        status: 200,
        success: true,
        message: "Demo request updated successfully",
        data: demoRequest
      });
    } catch (error) {
      console.error("Error updating demo request:", error);
      res.status(400).json({
        status: 400,
        success: false,
        message: "Failed to update demo request",
        error: { code: "VALIDATION_ERROR", details: error.message }
      });
    }
  }
  
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Status is required",
          error: { code: "VALIDATION_ERROR", details: "Status field is missing" }
        });
      }
      
      const demoRequest = await DemoRequestService.updateStatus(req.params.id, status);
      res.status(200).json({
        status: 200,
        success: true,
        message: "Demo request status updated successfully",
        data: demoRequest
      });
    } catch (error) {
      console.error("Error updating demo request status:", error);
      res.status(400).json({
        status: 400,
        success: false,
        message: "Failed to update demo request status",
        error: { code: "VALIDATION_ERROR", details: error.message }
      });
    }
  }
  
  async deleteDemoRequest(req, res) {
    try {
      const result = await DemoRequestService.deleteDemoRequest(req.params.id);
      res.status(200).json({
        status: 200,
        success: true,
        message: "Demo request deleted successfully",
        data: result
      });
    } catch (error) {
      console.error("Error deleting demo request:", error);
      res.status(400).json({
        status: 400,
        success: false,
        message: "Failed to delete demo request",
        error: { code: "VALIDATION_ERROR", details: error.message }
      });
    }
  }
}

module.exports = new DemoRequestController();