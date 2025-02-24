const express = require("express");
const  { getCommissionBreakdownController } = require("../controllers/storeRevenue.controller"); 


const router = express.Router(); 


// router.get("/:vendor_id", getVendorRevenueController);  
// router.get("/monthly/:vendor_id", getMonthlyRevnueController); 

router.get("/commission/:vendor_id", getCommissionBreakdownController);


module.exports = router;






