"use client";

import { useState } from "react";
import { useVendorAnalytics } from "@/app/hooks/storeRevenue/useVendorAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCounter } from "../animated-counter";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend,
} from "../charts/charts";
import { Building2, DollarSign, ShoppingCart, TrendingUp, Eye, ShoppingBag, Users } from "lucide-react";
import { motion } from "framer-motion";
import { vendor_id } from "@/app/utils/constant";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const CHART_COLORS = {
  primary: "#6366f1",
  secondary: "#ec4899",
  tertiary: "#06b6d4",
  quaternary: "#8b5cf6",
  success: "#22c55e",
  background: "#1e293b",
  text: "#f8fafc",
  muted: "#64748b",
};

interface RevenueData {
  name: string;
  revenue: number;
  commission: number;
}

interface MonthlyData {
  name: string;
  revenue: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface ProductData {
  name: string;
  revenue?: number;
  views?: number;
}

export default function RevenueAnalytics() {
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const { data, isLoading, isError } = useVendorAnalytics(vendor_id, selectedMonth);

  const months: string[] = ["All", "Dec", "Jan", "Feb", "Mar"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error loading data</div>;
  }

  if (!data) return null;

  const revenueData: RevenueData[] = data.commission.stores.map((store) => ({
    name: store.store_name,
    revenue: store.total_revenue,
    commission: store.total_commission,
  }));

  const monthlyData: MonthlyData[] = data.commission.monthly_revenue.map((item) => ({
    name: item.month,
    revenue: item.revenue,
  }));

  const pieData: PieData[] = [
    { name: "Final Revenue", value: Number.parseFloat(data.commission.final_vendor_revenue), color: CHART_COLORS.primary },
    { name: "Admin Commission", value: Number.parseFloat(data.commission.total_admin_commission), color: CHART_COLORS.secondary },
    { name: "Non-commissionable", value: Number.parseFloat(data.commission.non_commissionable_revenue), color: CHART_COLORS.tertiary },
  ];

  const topSellingData: ProductData[] = data.products.top_selling_products.map((p) => ({
    name: p.product_name,
    revenue: Number.parseFloat(p.total_revenue),
  }));

  const mostViewedData: ProductData[] = data.products.most_viewed_products.map((p) => ({
    name: p.product_name,
    views: p.view_count,
  }));

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
          Revenue & Analytics
        </h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full sm:w-48 p-2.5 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Overview Cards */}
      <motion.div
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-indigo-100 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[150px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Total Revenue</CardTitle>
              <div className="p-2 bg-indigo-500/20 rounded-full">
                <DollarSign className="w-4 h-4 text-indigo-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                $<AnimatedCounter value={Number(data.commission.total_vendor_revenue)} formatValue={(value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2 })} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Final: $<AnimatedCounter value={Number(data.commission.final_vendor_revenue)} formatValue={(value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2 })} />
              </p>
            </CardContent>
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -translate-y-12 translate-x-12"></div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-yellow-100 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[150px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Total Orders</CardTitle>
              <div className="p-2 bg-yellow-500/20 rounded-full">
                <ShoppingCart className="w-4 h-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                <AnimatedCounter value={data.commission.total_orders} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Commission: <AnimatedCounter value={data.commission.commission_total_orders} />
              </p>
            </CardContent>
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -translate-y-12 translate-x-12"></div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-teal-100 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[150px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Commission Rate</CardTitle>
              <div className="p-2 bg-teal-500/20 rounded-full">
                <TrendingUp className="w-4 h-4 text-teal-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{data.commission.commission_rate}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total: $<AnimatedCounter value={Number(data.commission.total_admin_commission)} formatValue={(value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2 })} />
              </p>
            </CardContent>
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full -translate-y-12 translate-x-12"></div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-purple-100 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[150px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Active Stores</CardTitle>
              <div className="p-2 bg-purple-500/20 rounded-full">
                <Building2 className="w-4 h-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                <AnimatedCounter value={data.commission.stores.length} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Contributing to revenue</p>
            </CardContent>
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -translate-y-12 translate-x-12"></div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Engagement Cards */}
      <motion.div
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-blue-100 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[150px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Product Views</CardTitle>
              <div className="p-2 bg-blue-500/20 rounded-full">
                <Eye className="w-4 h-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                <AnimatedCounter value={data.engagement.product_views} />
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-12 translate-x-12"></div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-orange-100 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[150px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Cart Abandonment</CardTitle>
              <div className="p-2 bg-orange-500/20 rounded-full">
                <ShoppingBag className="w-4 h-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {data.engagement.cart_abandonment.abandonment_rate}%
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total: <AnimatedCounter value={data.engagement.cart_abandonment.total_carts} />
              </p>
            </CardContent>
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full -translate-y-12 translate-x-12"></div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-white to-green-100 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 min-h-[150px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">Repeat Customers</CardTitle>
              <div className="p-2 bg-green-500/20 rounded-full">
                <Users className="w-4 h-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                <AnimatedCounter value={data.engagement.repeat_purchases.repeat_customer_count} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Orders: <AnimatedCounter value={data.engagement.repeat_purchases.total_orders_by_repeat_customers} />
              </p>
            </CardContent>
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -translate-y-12 translate-x-12"></div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-7">
        <Card className="col-span-1 xl:col-span-4 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke={CHART_COLORS.muted} tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} />
                <YAxis stroke={CHART_COLORS.muted} tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                    padding: "8px 12px",
                  }}
                  itemStyle={{ color: CHART_COLORS.background, fontWeight: "500" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={3}
                  dot={{ r: 5, fill: CHART_COLORS.primary, stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: CHART_COLORS.quaternary, stroke: "#fff", strokeWidth: 2 }}
                  fill="url(#lineGradient)"
                  animationDuration={1000}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 xl:col-span-3 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  animationDuration={800}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">Store-wise Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="name" stroke={CHART_COLORS.muted} tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} />
              <YAxis stroke={CHART_COLORS.muted} tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey="revenue"
                fill={CHART_COLORS.primary}
                name="Revenue"
                radius={[8, 8, 0, 0]}
                barSize={40}
                animationDuration={800}
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`revenue-${index}`} fill={`url(#barGradient${index % 2})`} />
                ))}
              </Bar>
              <Bar
                dataKey="commission"
                fill={CHART_COLORS.secondary}
                name="Commission"
                radius={[8, 8, 0, 0]}
                barSize={40}
                animationDuration={800}
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`commission-${index}`} fill={`url(#barGradient${(index + 1) % 2})`} />
                ))}
              </Bar>
              <defs>
                <linearGradient id="barGradient0" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.9} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.9} />
                  <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <Legend verticalAlign="top" height={36} iconType="rect" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Products */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellingData}>
                <XAxis dataKey="name" stroke={CHART_COLORS.muted} tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                <YAxis stroke={CHART_COLORS.muted} tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill={CHART_COLORS.quaternary}
                  name="Revenue"
                  radius={[8, 8, 0, 0]}
                  barSize={30}
                  animationDuration={800}
                >
                  {topSellingData.map((entry, index) => (
                    <Cell key={`revenue-${index}`} fill={`url(#productGradient${index % 2})`} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="productGradient0" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.quaternary} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={CHART_COLORS.quaternary} stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="productGradient1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <Legend verticalAlign="top" height={36} iconType="rect" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">Most Viewed Products</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostViewedData}>
                <XAxis dataKey="name" stroke={CHART_COLORS.muted} tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} angle={-45} textAnchor="end" height={60} />
                <YAxis stroke={CHART_COLORS.muted} tick={{ fill: CHART_COLORS.muted, fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="views"
                  fill={CHART_COLORS.success}
                  name="Views"
                  radius={[8, 8, 0, 0]}
                  barSize={30}
                  animationDuration={800}
                >
                  {mostViewedData.map((entry, index) => (
                    <Cell key={`views-${index}`} fill={`url(#productGradient${(index + 1) % 2})`} />
                  ))}
                </Bar>
                <Legend verticalAlign="top" height={36} iconType="rect" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}