const storeService = require("../services/store.service");

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

  async getStoreByUrl(req, res) {
    try {
      const storeUrl = req.params.store_url;
      if (!storeUrl) {
        return res
          .status(400)
          .json({ message: "Store URL parameter is required" });
      }

      const store = await storeService.getStoreByURL(storeUrl);
      return res.status(200).json(store);
    } catch (error) {
      console.error("Error in getStoreByUrl:", error);
      return res.status(500).json({ message: error.message });
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
      const vendorId = req.query.vendor_id || null;
      console.log("Vendor ID:", vendorId);
      const stores = await storeService.listStoresByVendor(vendorId);
      res.status(200).json(stores);
    } catch (error) {
      console.error("Error:", error);
      res.status(400).json({
        error: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
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

  async addDomain(req, res) {
    const { storeName } = req.body;

    if (!storeName) {
      return res.status(400).json({ error: "storeName is required" });
    }

    try {
      const domain = await storeService.addDomainToVercel(storeName);
      res.status(200).json({ domain });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new StoreController();
