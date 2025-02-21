const Vendor = require("../models/vendor.model");
const sequelize = require("../config/db"); // Ensure Sequelize instance is availableconst Store = require("../models/store.model");
const Order = require("../models/order.model");
const Plan = require("../models/plan.model"); 
const Store = require("../models/store.model");
const { Op, fn, col, literal,cast } = require("sequelize");









async function getCommissionBreakdown(vendorId) {
  try {
    // Fetch the vendor's plan and its commission rate
    const vendor = await Vendor.findOne({
      where: { id: vendorId },
      include: [{ model: Plan, as: "subscription_plan", attributes: ["commission_rate"] }],
    });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    const commissionRate = vendor.subscription_plan?.commission_rate || 0; // Default to 0% if missing

    // ✅ Fetch total orders count (all orders)
    const totalOrdersCount = await Order.count({
      where: { vendor_id: vendorId },
    });

    // ✅ Fetch total revenue (sum of total_amount for all orders)
    const totalVendorRevenueResult = await Order.findOne({
      attributes: [
        [fn("SUM", literal('CAST("total_amount" AS FLOAT)')), "total_revenue"],
      ],
      where: {
        vendor_id: vendorId,
        status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] },
        payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action", "refunded"] },
      },
      raw: true,
    });

    const totalVendorRevenue = parseFloat(totalVendorRevenueResult?.total_revenue || 0);

    // ✅ Fetch commissionable orders (total_amount > 200)
    const commissionableOrders = await Order.findAll({
      attributes: [
        "store_id",
        "total_amount",
        "created_at",
        [
          literal(`(CAST("total_amount" AS FLOAT) * ${commissionRate})`),
          "admin_commission",
        ],
      ],
      where: {
        vendor_id: vendorId,
        [Op.and]: [
          literal(`CAST("total_amount" AS FLOAT) > 200`),
          { status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] } },
          { payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action"] } },
        ],
      },
      order: [["created_at", "ASC"]],
    });

    // ✅ Fetch non-commissionable orders (total_amount ≤ 200)
    const nonCommissionableOrders = await Order.findOne({
      attributes: [
        [fn("SUM", literal('CAST("total_amount" AS FLOAT)')), "non_commissionable_revenue"],
      ],
      where: {
        vendor_id: vendorId,
        [Op.and]: [
          literal(`CAST("total_amount" AS FLOAT) <= 200`),
          { status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] } },
          { payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action"] } },
        ],
      },
      raw: true,
    });

    const nonCommissionableRevenue = parseFloat(nonCommissionableOrders?.non_commissionable_revenue || 0);

    // ✅ Fetch store details
    const stores = await Store.findAll({
      attributes: ["id", "name"],
      raw: true,
    });

    const storeMap = {};
    stores.forEach((store) => {
      storeMap[store.id] = store.name;
    });

    // ✅ Process commission breakdown
    const commissionByStore = {};

    commissionableOrders.forEach((order) => {
      const storeId = order.store_id;
      const storeName = storeMap[storeId] || "Unknown Store";
      const commission = parseFloat(order.getDataValue("admin_commission") || 0);
      const revenue = parseFloat(order.total_amount || 0);

      if (!commissionByStore[storeId]) {
        commissionByStore[storeId] = {
          store_id: storeId,
          store_name: storeName,
          total_revenue: 0,
          total_commission: 0,
          orders_count: 0,
        };
      }

      commissionByStore[storeId].total_revenue += revenue;
      commissionByStore[storeId].total_commission += commission;
      commissionByStore[storeId].orders_count += 1;
    });

    // ✅ Deduct admin commission from commissionable revenue
    const totalAdminCommission = Object.values(commissionByStore)
      .reduce((sum, store) => sum + store.total_commission, 0)
      .toFixed(2);

    // ✅ Final vendor revenue = (Total revenue - Admin commission) + Non-commissionable revenue
    const finalVendorRevenue = (totalVendorRevenue - totalAdminCommission).toFixed(2);

    // ✅ Fetch Monthly Revenue Data
    const revenueData = await Order.findAll({
      attributes: [
        [fn("DATE_TRUNC", "month", col("created_at")), "month"],
        [literal('SUM(CAST("total_amount" AS FLOAT))'), "total_revenue"],
      ],
      where: {
        vendor_id: vendorId,
        status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] },
        payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action", "refunded"] },
      },
      group: [literal(`DATE_TRUNC('month', "created_at")`)],
      order: [[literal(`DATE_TRUNC('month', "created_at")`), "ASC"]],
      raw: true,
    });

    const monthlyRevenue = revenueData.map((entry) => ({
      month: new Date(entry.month).toLocaleString("en-US", { month: "short" }), // Converts to "Jan", "Feb", etc.
      revenue: parseFloat(entry.total_revenue || 0),
    }));

    return {
      vendor_id: vendorId,
      commission_rate: `${commissionRate}%`,
      total_orders: totalOrdersCount, // ✅ Total number of orders (commissionable + non-commissionable)
      commission_total_orders: commissionableOrders.length, // ✅ Orders > 200 (eligible for commission)
      total_vendor_revenue: totalVendorRevenue.toFixed(2), // ✅ Total revenue (all orders)
      total_admin_commission: totalAdminCommission, // ✅ Total commission deducted
      non_commissionable_revenue: nonCommissionableRevenue.toFixed(2), // ✅ Orders ≤ 200 added to vendor revenue
      final_vendor_revenue: finalVendorRevenue, // ✅ Revenue after commission deduction + non-commissionable revenue
      stores: Object.values(commissionByStore),
      monthly_revenue: monthlyRevenue, // ✅ Monthly revenue data
    };
  } catch (error) {
    console.error("Error fetching commission breakdown:", error);
    throw error;
  }
}





module.exports = { getCommissionBreakdown};
