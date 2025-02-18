const Vendor = require("../models/vendor.model");
const Store = require("../models/store.model");
const Order = require("../models/order.model");
const { Op } = require("sequelize");

// async function getVendorRevenue(vendorId) {
//   try {
//     // Fetch all stores belonging to the vendor
//     const stores = await Store.findAll({
//       where: { vendor_id: vendorId },
//       include: [
//         {
//           model: Order,
//           as: "orders",
//           attributes: ["store_id", "total_amount"],
//           where: { 
//             status: "completed", 
//             payment_status: "captured" // Only count successfully paid orders
//           },
//           required: false,
//         },
//       ],
//     });

//     // Transform data into { storeName, revenue }
//     const storeRevenue = stores.map((store) => ({
//       name: store.name,
//       revenue: store.orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0),
//     }));

//     return storeRevenue;
//   } catch (error) {
//     console.error("Error fetching vendor revenue:", error);
//     throw error;
//   }
// } 


async function getVendorRevenue(vendorId) {
  try {
    const stores = await Store.findAll({
      where: { vendor_id: vendorId },
      include: [
        {
          model: Order,
          as: "orders",
          attributes: ["store_id", "total_amount", "payment_status"],
          required: false,
        },
      ],
    });

    const storeRevenue = stores.map((store) => {
      const capturedRevenue = store.orders
        .filter(order => order.payment_status === "captured")
        .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

      const pendingRevenue = store.orders
        .filter(order => order.payment_status === "awaiting" || order.payment_status === "requires_action")
        .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

      const refundedRevenue = store.orders
        .filter(order => order.payment_status === "refunded" || order.payment_status === "canceled")
        .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

      return {
        name: store.name,
        captured_revenue: capturedRevenue, // ✅ Money actually received
        pending_revenue: pendingRevenue, // ⏳ Money expected but not yet captured
        refunded_revenue: refundedRevenue // ❌ Money refunded/canceled
      };
    });

    return storeRevenue;
  } catch (error) {
    console.error("Error fetching vendor revenue:", error);
    throw error;
  }
}





module.exports = { getVendorRevenue };
