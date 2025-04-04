// server/services/demo-request.service.js
const DemoRequest = require('../models/demo.model.js');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let io = null;

// Create email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

class DemoRequestService {
  setSocketIo(socketIo) {
    io = socketIo;
  }

  async createDemoRequest(data) {
    try {
      const { name, email, company, message } = data;
      
      // Create demo request in database
      const demoRequest = await DemoRequest.create({
        name,
        email,
        company,
        message,
        status: 'new',
        read: false
      });

      // Send email to admin
      await this.sendAdminNotificationEmail(data);
      
      // Emit socket event if io is available
      if (io) {
        io.to("admin_room").emit("newDemoRequest", demoRequest);
      }
      
      return demoRequest;
    } catch (error) {
      logger.error(`Failed to create demo request: ${error.message}`);
      throw new Error(`Failed to create demo request: ${error.message}`);
    }
  }
  
  async sendAdminNotificationEmail(data) {
    try {
      const { name, email, company, message } = data;
      
      const mailOptions = {
        from: `"Vendor Hub" <${process.env.SMTP_USERNAME}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Demo Request from ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
              .header { background-color: #f5f5f5; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
              .btn { display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Demo Request</h2>
              </div>
              <div class="content">
                <p>A new demo request has been submitted through the website.</p>
                <h3>Contact Information</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <h3>Message</h3>
                <p>${message}</p>
                <p style="margin-top: 20px;">
                  <a href="${process.env.ADMIN_DASHBOARD_URL}/demo-requests" class="btn">View in Dashboard</a>
                </p>
              </div>
              <div class="footer">
                <p>This is an automated message from Vendor Hub.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };
      
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Demo request email sent to admin for request from ${email}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send demo request email: ${error.message}`);
      return false;
    }
  }
  
  async getAllDemoRequests() {
    try {
      return await DemoRequest.findAll({
        order: [['created_at', 'DESC']]
      });
    } catch (error) {
      throw new Error(`Failed to get demo requests: ${error.message}`);
    }
  }
  
  async getDemoRequestById(id) {
    try {
      const demoRequest = await DemoRequest.findByPk(id);
      if (!demoRequest) {
        throw new Error('Demo request not found');
      }
      
      return demoRequest;
    } catch (error) {
      throw new Error(`Failed to get demo request: ${error.message}`);
    }
  }
  
  async updateDemoRequest(id, data) {
    try {
      const demoRequest = await DemoRequest.findByPk(id);
      if (!demoRequest) {
        throw new Error('Demo request not found');
      }
      
      await demoRequest.update(data);
      return demoRequest;
    } catch (error) {
      throw new Error(`Failed to update demo request: ${error.message}`);
    }
  }
  
  async markAsRead(id) {
    const updatedRequest = await this.updateDemoRequest(id, { read: true });
    
    // Emit socket event if io is available
    if (io) {
      io.to("admin_room").emit("demoRequestUpdated", updatedRequest);
    }
    
    return updatedRequest;
  }
  
  async updateStatus(id, status) {
    if (!['new', 'contacted', 'completed'].includes(status)) {
      throw new Error('Invalid status value');
    }
    
    const updatedRequest = await this.updateDemoRequest(id, { status });
    
    // Emit socket event if io is available
    if (io) {
      io.to("admin_room").emit("demoRequestUpdated", updatedRequest);
    }
    
    return updatedRequest;
  }
  
  async deleteDemoRequest(id) {
    try {
      const demoRequest = await DemoRequest.findByPk(id);
      if (!demoRequest) {
        throw new Error('Demo request not found');
      }
      
      await demoRequest.destroy();
      return { message: 'Demo request deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete demo request: ${error.message}`);
    }
  }
}

module.exports = new DemoRequestService();