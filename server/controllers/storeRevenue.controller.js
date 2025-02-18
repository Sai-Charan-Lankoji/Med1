const {getVendorRevenue} = require("../services/storeRevenue.service");


const getVendorRevenueController = async (req,res) =>{
  try{
    const {vendor_id} = req.params;
    const revenueData = await getVendorRevenue(vendor_id);
    res.status(200).json(revenueData);
  }catch(error){
    console.error("Error fetching vendor revenue:", error);
    res.status(500).json({error: "Internal server error"});
  }
}

module.exports = { getVendorRevenueController };