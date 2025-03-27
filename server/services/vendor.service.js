const Vendor = require("../models/vendor.model");
const Address = require("../models/address.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { fn, col, literal, Op } = require("sequelize");
const Plan = require("../models/plan.model"); // Assuming this exists
const Order = require("../models/order.model");
const Store = require("../models/store.model"); // Adjust based on your actual model

const generateEntityId = (prefix) => {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
};

class VendorService {
  async getAllVendors() {
    return await Vendor.findAll({ include: ["address"] });
  }

  async updateVendorPlan(vendorId, { plan_id, plan }) {
    try {
      if (!vendorId || !plan_id || !plan) {
        throw new Error("Vendor ID, plan ID, and plan name are required");
      }

      const vendor = await Vendor.findByPk(vendorId, {
        include: [{ model: Plan, as: "subscription_plan" }],
      });
      if (!vendor) {
        throw new Error("Vendor not found");
      }

      const planExists = await Plan.findByPk(plan_id);
      if (!planExists) {
        throw new Error("Plan not found");
      }

      const updatedVendor = await vendor.update({
        plan_id,
        plan,
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Reset billing cycle
      });

      return updatedVendor;
    } catch (error) {
      console.error("Error updating vendor plan:", error.message);
      throw error;
    }
  }

  async getVendorById(id) {
    const vendor = await Vendor.findByPk(id, {
      include: [
        {
          model: Address,
          as: "address", // Ensure alias matches the association
        },
      ],
    });

    if (!vendor) {
      throw new Error("Vendor not found.");
    }

    // Format the data
    return this.formatVendorData(vendor);
  }

  formatVendorData(vendor) {
    // Helper function to split fields based on the "-" symbol
    const splitField = (field) => {
      if (!field || !field.includes("-"))
        return { vendorValue: field, registrationValue: field };
      const [vendorValue, registrationValue] = field
        .split(" -")
        .map((str) => str.trim());
      return { vendorValue, registrationValue };
    };

    // Extract and split address fields
    const address_1 = splitField(vendor.address[0]?.address_1);
    const address_2 = splitField(vendor.address[0]?.address_2);
    const city = splitField(vendor.address[0]?.city);
    const postal_code = splitField(vendor.address[0]?.postal_code);
    const province = splitField(vendor.address[0]?.province);
    const phone = splitField(vendor.address[0]?.phone);

    return {
      vendor: {
        company_name: vendor.company_name,
        password: vendor.password, // Avoid sending hashed passwords in production
        confirmPassword: vendor.password,
        contact_name: vendor.contact_name,
        contact_email: vendor.contact_email,
        contact_phone_number: vendor.contact_phone_number,
        registered_number: vendor.registered_number,
        tax_number: vendor.tax_number || "",
        business_type: vendor.business_type,
        plan: vendor.plan,
        plan_id: vendor.plan_id,
        vendorAddress: {
          address_1: address_1.vendorValue,
          address_2: address_2.vendorValue,
          city: city.vendorValue,
          postal_code: postal_code.vendorValue,
          province: province.vendorValue,
          phone: phone.vendorValue,
          first_name: vendor.address[0]?.first_name,
          last_name: vendor.address[0]?.last_name,
        },
        registrationAddress: {
          address_1: address_1.registrationValue,
          address_2: address_2.registrationValue,
          city: city.registrationValue,
          postal_code: postal_code.registrationValue,
          province: province.registrationValue,
          phone: phone.registrationValue,
        },
      },
    };
  }

  async createVendor(data) {
    try {
      // Check for existing vendor with the same email
      const existingVendor = await Vendor.findOne({
        where: { contact_email: data.contact_email },
      });

      if (existingVendor) {
        throw new Error("Vendor with this email already exists.");
      }

      // Generate a unique ID for the vendor
      const vendorId = generateEntityId("vendor");

      // Hash the vendor's password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create the vendor
      const vendor = await Vendor.create({
        id: vendorId,
        ...data,
        password: hashedPassword,
      });

      console.log("Vendor created: ", vendor);

      // Create vendor address if provided
      if (data.vendorAddressData) {
        const vendorAddress = {
          id: generateEntityId("address"),
          vendor_address_id: vendor.id, // Associate the address with the vendor
          company: data.company_name,
          first_name: data.vendorAddressData.first_name,
          last_name: data.vendorAddressData.last_name,
          address_1: data.vendorAddressData.address_1,
          address_2: data.vendorAddressData.address_2,
          city: data.vendorAddressData.city,
          province: data.vendorAddressData.province,
          postal_code: data.vendorAddressData.postal_code,
          phone: data.vendorAddressData.phone,
        };
        console.log("Vendor Address: ", vendorAddress);
        await Address.create(vendorAddress);
      }

      // Create registration address if provided
      if (data.registrationAddressData) {
        const registrationAddress = {
          id: generateEntityId("address"),
          registration_address_id: vendor.id, // Associate the address with the vendor
          company: data.company_name,
          first_name: data.registrationAddressData.first_name,
          last_name: data.registrationAddressData.last_name,
          address_1: data.registrationAddressData.address_1,
          address_2: data.registrationAddressData.address_2,
          city: data.registrationAddressData.city,
          province: data.registrationAddressData.province,
          postal_code: data.registrationAddressData.postal_code,
          phone: data.registrationAddressData.phone,
        };
        console.log("Registration Address: ", registrationAddress);
        await Address.create(registrationAddress);
      }

      return vendor;
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // Handle Sequelize validation errors
        throw new Error(error.errors.map((e) => e.message).join(", "));
      }
      throw error;
    }
  }

  async updateVendor(id, data) {
    const vendor = await this.getVendorById(id);
    return await vendor.update(data);
  }

  async deleteVendor(id) {
    const vendor = await this.getVendorById(id);
    return await vendor.destroy({ force: true });
  }

  // Method 1: Get commission breakdown for all vendors
  async getVendorAnalytics() {
    try {
      // ✅ Fetch total vendors count
      const totalVendorsCount = await Vendor.count();
  
      if (totalVendorsCount === 0) {
        return {
          status: "success",
          statusCode: 200,
          message: "No vendors found",
          data: {
            total_vendors: 0,
            total_orders: 0,
            commission_total_orders: 0,
            total_vendor_revenue: "0.00",
            total_admin_commission: "0.00",
            non_commissionable_revenue: "0.00",
            final_vendor_revenue: "0.00",
            monthly_revenue: [],
          },
        };
      }
  
      // ✅ Fetch all vendors with their commission rates
      const vendors = await Vendor.findAll({
        include: [{ model: Plan, as: "subscription_plan", attributes: ["commission_rate"] }],
      });
  
      // ✅ Fetch total revenue for all orders
      const totalVendorRevenueResult = await Order.findOne({
        attributes: [
          [fn("SUM", literal('CAST("total_amount" AS FLOAT)')), "total_revenue"],
        ],
        where: {
          status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] },
          payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action", "refunded"] },
        },
        raw: true,
      });
  
      const totalVendorRevenue = parseFloat(totalVendorRevenueResult?.total_revenue || 0).toFixed(2);
  
      // ✅ Fetch commissionable orders (total_amount > 200)
      const commissionableOrders = await Order.findAll({
        attributes: ["vendor_id", "total_amount"],
        where: {
          [Op.and]: [
            literal(`CAST("total_amount" AS FLOAT) > 200`),
            { status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] } },
            { payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action"] } },
          ],
        },
      });
  
      // ✅ Fetch non-commissionable revenue (total_amount ≤ 200)
      const nonCommissionableOrders = await Order.findOne({
        attributes: [
          [fn("SUM", literal('CAST("total_amount" AS FLOAT)')), "non_commissionable_revenue"],
        ],
        where: {
          [Op.and]: [
            literal(`CAST("total_amount" AS FLOAT) <= 200`),
            { status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] } },
            { payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action"] } },
          ],
        },
        raw: true,
      });
  
      const nonCommissionableRevenue = parseFloat(nonCommissionableOrders?.non_commissionable_revenue || 0).toFixed(2);
  
      // ✅ Calculate total admin commission using vendor-specific rates
      const vendorMap = {};
      vendors.forEach((vendor) => {
        vendorMap[vendor.id] = vendor.subscription_plan?.commission_rate || 0;
      });
  
      let totalAdminCommission = 0;
      commissionableOrders.forEach((order) => {
        const commissionRate = vendorMap[order.vendor_id] || 0;
        const revenue = parseFloat(order.total_amount || 0);
        totalAdminCommission += revenue * commissionRate;
      });
      totalAdminCommission = totalAdminCommission.toFixed(2);
  
      // ✅ Final vendor revenue
      const finalVendorRevenue = (parseFloat(totalVendorRevenue) - parseFloat(totalAdminCommission) + parseFloat(nonCommissionableRevenue)).toFixed(2);
  
      // ✅ Fetch total orders count
      const totalOrdersCount = await Order.count({
        where: {
          status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] },
          payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action", "refunded"] },
        },
      });
  
      // ✅ Fetch monthly revenue for all vendors
      const revenueData = await Order.findAll({
        attributes: [
          [fn("DATE_TRUNC", "month", col("created_at")), "month"],
          [literal('SUM(CAST("total_amount" AS FLOAT))'), "total_revenue"],
        ],
        where: {
          status: { [Op.in]: ["pending", "completed", "archived", "requires_action"] },
          payment_status: { [Op.in]: ["awaiting", "captured", "partially_refunded", "requires_action", "refunded"] },
        },
        group: [literal(`DATE_TRUNC('month', "created_at")`)],
        order: [[literal(`DATE_TRUNC('month', "created_at")`), "ASC"]],
        raw: true,
      });
  
      const monthlyRevenue = revenueData.map((entry) => ({
        month: new Date(entry.month).toLocaleString("en-US", { month: "short" }),
        revenue: parseFloat(entry.total_revenue || 0).toFixed(2),
      }));
  
      return {
        status: "success",
        statusCode: 200,
        message: "Vendor commission breakdown retrieved successfully",
        data: {
          total_vendors: totalVendorsCount,
          total_orders: totalOrdersCount,
          commission_total_orders: commissionableOrders.length,
          total_vendor_revenue: totalVendorRevenue,
          total_admin_commission: totalAdminCommission,
          non_commissionable_revenue: nonCommissionableRevenue,
          final_vendor_revenue: finalVendorRevenue,
          monthly_revenue: monthlyRevenue,
        },
      };
    } catch (error) {
      console.error("Error fetching vendor commission breakdown:", error);
      throw {
        status: "error",
        statusCode: 500,
        message: error.message || "Failed to retrieve vendor commission breakdown",
      };
    }
  }
  
  // Method 2: Get store commission breakdown and monthly revenue by vendor_id
  async  getStoreCommissionBreakdownByVendor(vendorId) {
    try {
      // ✅ Validate vendorId
      if (!vendorId || typeof vendorId !== "string") {
        return {
          status: "error",
          statusCode: 400, // Bad Request
          message: "Invalid or missing vendorId",
          data: null,
        };
      }
  
      // ✅ Validate vendor existence
      const vendor = await Vendor.findOne({
        where: { id: vendorId },
        include: [{ model: Plan, as: "subscription_plan", attributes: ["commission_rate"] }],
      });
  
      if (!vendor) {
        return {
          status: "error",
          statusCode: 404,
          message: "Vendor not found",
          data: null,
        };
      }
  
      const commissionRate = vendor.subscription_plan?.commission_rate || 0;
  
      // ✅ Fetch commissionable orders (total_amount > 200) for this vendor
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
  
      // ✅ Fetch store details
      const stores = await Store.findAll({
        attributes: ["id", "name"],
        raw: true,
      });
  
      const storeMap = {};
      stores.forEach((store) => {
        storeMap[store.id] = store.name;
      });
  
      // ✅ Process commission breakdown by store
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
  
      // ✅ Fetch monthly revenue for this vendor
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
        month: new Date(entry.month).toLocaleString("en-US", { month: "short" }),
        revenue: parseFloat(entry.total_revenue || 0).toFixed(2),
      }));
  
      return {
        status: "success",
        statusCode: 200,
        message: "Store commission breakdown retrieved successfully",
        data: {
          vendor_id: vendorId,
          commission_rate: `${commissionRate * 100}%`,
          stores: Object.values(commissionByStore),
          monthly_revenue: monthlyRevenue,
          next_billing_date: new Date(vendor.next_billing_date)
        },
      };
    } catch (error) {
      console.error(`Error fetching store commission breakdown for vendorId: ${vendorId}`, error);
      throw {
        status: "error",
        statusCode: error.statusCode || 500,
        message: error.message || "Failed to retrieve store commission breakdown",
      };
    }
  }
}

module.exports = new VendorService();
