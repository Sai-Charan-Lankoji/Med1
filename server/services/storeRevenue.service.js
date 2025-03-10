const Vendor = require("../models/vendor.model");
const sequelize = require("../config/db");
const Store = require("../models/store.model");
const Order = require("../models/order.model");
const Plan = require("../models/plan.model");
const Product = require("../models/product.model");
const ProductView = require("../models/productView.model");
const Cart2 = require("../models/cart2.model");
const { Op, fn, col, literal } = require("sequelize");
const { Parser } = require("json2csv");

async function getCommissionData(vendorId, filters = {}) {
  const { startDate, endDate, export: exportFormat } = filters;
  const whereClause = {
    vendor_id: vendorId,
    status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] },
    payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action", "refunded"] },
  };
  if (startDate && endDate) whereClause.created_at = { [Op.between]: [startDate, endDate] };

  const vendor = await Vendor.findOne({
    where: { id: vendorId },
    include: [{ model: Plan, as: "subscription_plan", attributes: ["commission_rate"] }],
  });
  if (!vendor) throw new Error("Vendor not found");
  const commissionRate = vendor.subscription_plan?.commission_rate || 0;

  const totalOrdersCount = await Order.count({ where: whereClause });

  const totalVendorRevenueResult = await Order.findOne({
    attributes: [[fn("SUM", literal('CAST("total_amount" AS FLOAT)')), "total_revenue"]],
    where: whereClause,
    raw: true,
  });
  const totalVendorRevenue = parseFloat(totalVendorRevenueResult?.total_revenue || 0);

  const commissionableOrders = await Order.findAll({
    attributes: [
      "store_id",
      "total_amount",
      "created_at",
      [literal(`(CAST("total_amount" AS FLOAT) * ${commissionRate})`), "admin_commission"],
    ],
    where: {
      ...whereClause,
      [Op.and]: [literal(`CAST("total_amount" AS FLOAT) > 200`)],
    },
    order: [["created_at", "ASC"]],
  });

  const nonCommissionableOrders = await Order.findOne({
    attributes: [[fn("SUM", literal('CAST("total_amount" AS FLOAT)')), "non_commissionable_revenue"]],
    where: {
      ...whereClause,
      [Op.and]: [literal(`CAST("total_amount" AS FLOAT) <= 200`)],
    },
    raw: true,
  });
  const nonCommissionableRevenue = parseFloat(nonCommissionableOrders?.non_commissionable_revenue || 0);

  const stores = await Store.findAll({ attributes: ["id", "name"], raw: true });
  const storeMap = {};
  stores.forEach((store) => (storeMap[store.id] = store.name));

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

  const totalAdminCommission = parseFloat(
    Object.values(commissionByStore)
      .reduce((sum, store) => sum + store.total_commission, 0)
      .toFixed(2)
  );
  const finalVendorRevenue = (totalVendorRevenue - totalAdminCommission + nonCommissionableRevenue).toFixed(2);

  const monthlyRevenue = await Order.findAll({
    attributes: [
      [fn("DATE_TRUNC", "month", col("created_at")), "month"],
      [literal('SUM(CAST("total_amount" AS FLOAT))'), "total_revenue"],
    ],
    where: whereClause,
    group: [literal(`DATE_TRUNC('month', "created_at")`)],
    order: [[literal(`DATE_TRUNC('month', "created_at")`), "ASC"]],
    raw: true,
  }).then((data) =>
    data.map((entry) => ({
      month: new Date(entry.month).toLocaleString("en-US", { month: "short" }),
      revenue: parseFloat(entry.total_revenue || 0),
    }))
  );

  const result = {
    vendor_id: vendorId,
    commission_rate: `${commissionRate * 100}%`,
    total_orders: totalOrdersCount,
    commission_total_orders: commissionableOrders.length,
    total_vendor_revenue: totalVendorRevenue.toFixed(2),
    total_admin_commission: totalAdminCommission.toFixed(2),
    non_commissionable_revenue: nonCommissionableRevenue.toFixed(2),
    final_vendor_revenue: finalVendorRevenue,
    stores: Object.values(commissionByStore),
    monthly_revenue: monthlyRevenue,
  };

  if (exportFormat === "csv") {
    const fields = Object.keys(result);
    const parser = new Parser({ fields });
    return parser.parse(result);
  }

  return result;
}

async function getEngagementData(vendorId, filters = {}) {
  const { startDate, endDate } = filters;
  const whereClause = {
    vendor_id: vendorId,
    status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] },
    payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action", "refunded"] },
  };
  if (startDate && endDate) whereClause.created_at = { [Op.between]: [startDate, endDate] };

  const productViews = await getProductViews(vendorId, whereClause);
  const mostViewedProducts = await getMostViewedProducts(vendorId, whereClause);
  const cartAbandonment = await getCartAbandonment(vendorId, whereClause);
  const repeatPurchases = await getRepeatPurchases(vendorId, whereClause);

  return {
    product_views: productViews,
    most_viewed_products: mostViewedProducts,
    cart_abandonment: cartAbandonment,
    repeat_purchases: repeatPurchases,
  };
}

async function getProductStats(vendorId, filters = {}) {
  const { startDate, endDate } = filters;
  const whereClause = {
    vendor_id: vendorId,
    status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] },
    payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action", "refunded"] },
  };
  if (startDate && endDate) whereClause.created_at = { [Op.between]: [startDate, endDate] };

  const topSellingProducts = await getTopSellingProducts(vendorId, whereClause);
  const mostViewedProducts = await getMostViewedProducts(vendorId, whereClause);

  return {
    top_selling_products: topSellingProducts,
    most_viewed_products: mostViewedProducts,
  };
}

async function getTopSellingProducts(vendorId, whereClause, limit = 5) {
  const orders = await Order.findAll({
    attributes: ["id", "line_items", "total_amount"],
    where: whereClause,
    raw: true,
  });

  const productStats = {};
  orders.forEach((order) => {
    const lineItems = order.line_items || [];
    lineItems.forEach((item) => {
      const productId = item.product_id;
      if (!productId || productId.startsWith("cart_")) return;
      if (!productStats[productId]) {
        productStats[productId] = { order_count: 0, total_revenue: 0 };
      }
      productStats[productId].order_count += 1;
      productStats[productId].total_revenue += parseFloat(item.price || 0) * parseInt(item.quantity || 0);
    });
  });

  const topProducts = Object.entries(productStats)
    .map(([product_id, stats]) => ({
      product_id,
      order_count: stats.order_count,
      total_revenue: stats.total_revenue.toFixed(2),
    }))
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, limit);

  const productIds = topProducts.map((p) => p.product_id);
  const products = await Product.findAll({
    where: { id: { [Op.in]: productIds } },
    attributes: ["id", "title"],
    raw: true,
  });
  const productMap = {};
  products.forEach((p) => (productMap[p.id] = p.title));

  return topProducts.map((p) => ({
    product_id: p.product_id,
    product_name: productMap[p.product_id] || "Unknown",
    order_count: p.order_count,
    total_revenue: p.total_revenue,
  }));
}

async function getProductViews(vendorId, whereClause) {
  const views = await ProductView.count({
    where: { vendor_id: vendorId, ...(whereClause.created_at && { viewed_at: whereClause.created_at }) },
  });
  return views;
}

async function getMostViewedProducts(vendorId, whereClause, limit = 5) {
  const views = await ProductView.findAll({
    attributes: [
      "product_id",
      [fn("COUNT", col("id")), "view_count"],
    ],
    where: { 
      vendor_id: vendorId, 
      ...(whereClause.created_at && { viewed_at: whereClause.created_at }),
    },
    group: ["product_id"],
    order: [[literal("view_count"), "DESC"]],
    limit,
    raw: true,
  });

  const productIds = views.map((v) => v.product_id);
  const products = await Product.findAll({
    where: { id: { [Op.in]: productIds } },
    attributes: ["id", "title"],
    raw: true,
  });
  const productMap = {};
  products.forEach((p) => (productMap[p.id] = p.title));

  return views.map((v) => ({
    product_id: v.product_id,
    product_name: productMap[v.product_id] || "Unknown",
    view_count: parseInt(v.view_count),
  }));
}

async function getCartAbandonment(vendorId, whereClause) {
  const carts = await Cart2.findAll({
    attributes: ["id", "customer_id", "email", "createdAt"],
    include: [{
      model: Product,
      as: "designable_product",
      attributes: [],
      where: { vendor_id: vendorId },
    }],
    where: {
      deletedAt: null,
      ...(whereClause.created_at && { createdAt: whereClause.created_at }),
    },
    raw: true,
  });

  const orders = await Order.findAll({
    attributes: ["cart_id", "customer_id", "email"],
    where: whereClause,
    raw: true,
  });

  const orderCartIds = new Set(orders.map(o => o.cart_id).filter(id => id));
  let abandonedCarts;
  if (orderCartIds.size > 0) {
    abandonedCarts = carts.filter(cart => !orderCartIds.has(cart.id)).length;
  } else {
    const orderKeys = new Set(orders.map(o => `${o.customer_id}-${o.email}`).filter(key => key && key !== "-"));
    abandonedCarts = carts.filter(cart => !orderKeys.has(`${cart.customer_id}-${cart.email}`)).length;
  }

  const totalCarts = carts.length;
  return {
    total_carts: totalCarts,
    abandoned_carts: abandonedCarts,
    abandonment_rate: totalCarts ? ((abandonedCarts / totalCarts) * 100).toFixed(2) : 0,
  };
}

async function getRepeatPurchases(vendorId, whereClause) {
  const repeatCustomers = await Order.findAll({
    attributes: ["customer_id", [fn("COUNT", col("id")), "order_count"]],
    where: { vendor_id: vendorId, ...whereClause },
    group: ["customer_id"],
    having: literal(`COUNT("id") > 1`),
    raw: true,
  });
  return {
    repeat_customer_count: repeatCustomers.length,
    total_orders_by_repeat_customers: repeatCustomers.reduce((sum, c) => sum + parseInt(c.order_count || 0), 0),
  };
}

async function logProductView(productId, storeId) {
  try {
    const store = await Store.findOne({ where: { id: storeId }, attributes: ["vendor_id"] });
    const vendorId = store?.vendor_id || null;
    const view = await ProductView.create({
      product_id: productId,
      store_id: storeId,
      vendor_id: vendorId,
      viewed_at: new Date(),
    });
    return view;
  } catch (error) {
    console.error("Error logging product view:", error);
    throw error;
  }
}

module.exports = { getCommissionData, getEngagementData, getProductStats, logProductView };