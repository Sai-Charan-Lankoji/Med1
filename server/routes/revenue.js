const express = require("express");
const  storeRevenueController = require("../controllers/storeRevenue.controller"); 


const router = express.Router(); 


router.get("/:vendor_id", storeRevenueController.getVendorRevenueController); 

module.exports = router;






