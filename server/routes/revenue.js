const express = require("express");
const router = express.Router();
const { 
  getCommissionDataController, 
  getEngagementDataController, 
  getProductStatsController, 
  logProductViewController 
} = require("../controllers/storeRevenue.controller");

router.get("/commission/:vendorId", getCommissionDataController);
router.get("/engagement/:vendorId", getEngagementDataController);
router.get("/topSelling-products/:vendorId", getProductStatsController);
router.post("/product-view", logProductViewController);

module.exports = router;    