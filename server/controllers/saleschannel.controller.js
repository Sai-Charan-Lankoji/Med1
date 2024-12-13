const salesChannelService = require('../services/saleschannel.service');

class SalesChannelController {
  async createSalesChannel(req, res) {
    try {
      const salesChannel = await salesChannelService.createSalesChannel(req.body);
      res.status(201).json(salesChannel);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getSalesChannel(req, res) {
    try {
      const salesChannel = await salesChannelService.getSalesChannelById(req.params.id);
      res.status(200).json(salesChannel);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateSalesChannel(req, res) {
    try {
      const salesChannel = await salesChannelService.updateSalesChannel(req.params.id, req.body);
      res.status(200).json(salesChannel);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteSalesChannel(req, res) {
    try {
      await salesChannelService.deleteSalesChannel(req.params.id);
      res.status(200).json({ message: 'Sales Channel deleted successfully' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async listSalesChannelsByVendor(req, res) {
    try {
      const salesChannels = await salesChannelService.listSalesChannelsByVendor(req.params.vendor_id);
      res.status(200).json(salesChannels);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new SalesChannelController();
