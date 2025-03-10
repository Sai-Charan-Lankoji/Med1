const { getCommissionData, getEngagementData, getProductStats, logProductView } = require("../services/storeRevenue.service");

async function getCommissionDataController(req, res) {
  try {
    const { vendorId } = req.params;
    const filters = req.query;
    const result = await getCommissionData(vendorId, filters);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch commission data" });
  }
}

async function getEngagementDataController(req, res) {
  try {
    const { vendorId } = req.params;
    const filters = req.query;
    const result = await getEngagementData(vendorId, filters);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch engagement data" });
  }
}

async function getProductStatsController(req, res) {
  try {
    const { vendorId } = req.params;
    const filters = req.query;
    const result = await getProductStats(vendorId, filters);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product stats" });
  }
}

async function logProductViewController(req, res) {
  try {
    const { product_id, store_id } = req.body;
    if (!product_id || !store_id) {
      return res.status(400).json({ error: "product_id and store_id are required" });
    }
    const view = await logProductView(product_id, store_id);
    res.status(201).json({ message: "Product view logged", view });
  } catch (error) {
    res.status(500).json({ error: "Failed to log product view" });
  }
}

module.exports = { 
  getCommissionDataController, 
  getEngagementDataController, 
  getProductStatsController, 
  logProductViewController 
};