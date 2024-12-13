const storeService = require('../services/store.service');

class StoreController {
  async createStore(req, res) {
    try {
      const store = await storeService.createStore(req.body);
      res.status(201).json(store);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStore(req, res) {
    try {
      const store = await storeService.retrieveById(req.params.id);
      res.status(200).json(store);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateStore(req, res) {
    try {
      const store = await storeService.updateStore(req.params.id, req.body);
      res.status(200).json(store);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteStore(req, res) {
    try {
      const result = await storeService.deleteStore(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async listStoresByVendor(req, res) {
    try {
      const stores = await storeService.listStoresByVendor(req.query.vendor_id || null);
      res.status(200).json(stores);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async listStores(req, res) {
    try {
      const stores = await storeService.listStores();
      res.status(200).json(stores);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new StoreController();
