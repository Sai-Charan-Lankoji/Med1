const {getVendorRevenue,getTotalMonthlyRevenue,getCommissionBreakdown} = require("../services/storeRevenue.service"); 



// const getVendorRevenueController = async (req,res) =>{
//   try{
//     const {vendor_id} = req.params;
//     const revenueData = await getVendorRevenue(vendor_id);
//     res.status(200).json(revenueData);
//   }catch(error){
//     console.error("Error fetching vendor revenue:", error);
//     res.status(500).json({error: "Internal server error"});
//   }
// } 


// const getMonthlyRevnueController = async (req,res) =>{
//   try{
//     const {vendor_id} = req.params;
//     const revenueData = await getTotalMonthlyRevenue(vendor_id);
//     res.status(200).json({revenue: revenueData});
//   }catch(error){
//     console.error("Error fetching vendor revenue:", error);
//     res.status(500).json({error: "Internal server error"});
//   }
// } 


const getCommissionBreakdownController = async (req,res) =>{
  try{
    const {vendor_id} = req.params;
    const revenueData = await getCommissionBreakdown(vendor_id);
    res.status(200).json(revenueData);
  }catch(error){
    console.error("Error fetching vendor revenue:", error);
    res.status(500).json({error: "Internal server error"});
  }
}

module.exports = { getCommissionBreakdownController};