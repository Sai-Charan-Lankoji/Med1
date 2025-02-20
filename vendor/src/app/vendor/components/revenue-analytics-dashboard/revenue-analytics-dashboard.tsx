"use client"

import { useVendorAnalytics } from "@/app/hooks/storeRevenue/useVendorAnalytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedCounter } from "../animated-counter"
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
} from "../charts/charts"
import { Building2, DollarSign, ShoppingCart, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { vendor_id } from "@/app/utils/constant"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const CHART_COLORS = {
  primary: "#6366f1",
  secondary: "#ec4899",
  tertiary: "#06b6d4",
  quaternary: "#8b5cf6",
  success: "#22c55e",
  background: "#1e293b",
  text: "#f8fafc",
  muted: "#f8fafc",
}

export default function RevenueAnalytics() {
  const { data, isError, isLoading } = useVendorAnalytics(vendor_id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isError) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error loading data</div>
  }

  if (!data) return null

  const revenueData = data.stores.map((store) => ({
    name: store.store_name,
    revenue: store.total_revenue,
    commission: store.total_commission,
  }))

  const monthlyData = data.monthly_revenue.map((item) => ({
    name: item.month,
    revenue: item.revenue,
  }))

  const pieData = [
    {
      name: "Final Revenue",
      value: Number.parseFloat(data.final_vendor_revenue),
      color: CHART_COLORS.primary,
    },
    {
      name: "Admin Commission",
      value: Number.parseFloat(data.total_admin_commission),
      color: CHART_COLORS.secondary,
    },
    {
      name: "Non-commissionable",
      value: Number.parseFloat(data.non_commissionable_revenue),
      color: CHART_COLORS.tertiary,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
          Revenue Analytics
        </h2>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-white to-violet-100 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent >
              <div className="text-2xl font-bold text-primary">
                $
                <AnimatedCounter
                  value={Number(data.total_vendor_revenue)}
                  formatValue={(value) =>
                    value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Final revenue: $
                <AnimatedCounter
                  value={Number(data.final_vendor_revenue)}
                  formatValue={(value) =>
                    value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }
                />
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-white to-yellow-100 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium ">Total Orders</CardTitle>
              <div className="p-2 bg-secondary/10 rounded-full">
                <ShoppingCart className="w-4 h-4 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                <AnimatedCounter value={data.total_orders} />
              </div>
              <p className="text-xs text-muted-foreground">
                Commission orders: <AnimatedCounter value={data.commission_total_orders} />
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-white to-green-100 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <div className="p-2 bg-tertiary/10 rounded-full">
                <TrendingUp className="w-4 h-4 text-tertiary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-tertiary">{data.commission_rate}</div>
              <p className="text-xs text-muted-foreground">
                Total commission: $
                <AnimatedCounter
                  value={Number(data.total_admin_commission)}
                  formatValue={(value) =>
                    value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  }
                />
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-white to-red-100 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
              <div className="p-2 bg-quaternary/10 rounded-full">
                <Building2 className="w-4 h-4 text-quaternary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-quaternary">
                <AnimatedCounter value={data.stores.length} />
              </div>
              <p className="text-xs text-muted-foreground">Contributing to revenue</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke={CHART_COLORS.muted} />
                <YAxis stroke={CHART_COLORS.muted} />
                <Tooltip
                  contentStyle={{
                    background: CHART_COLORS.background,
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ color: CHART_COLORS.text }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.primary, strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: CHART_COLORS.quaternary }}
                  fill="url(#revenueGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={CHART_COLORS.primary}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Store-wise Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill={CHART_COLORS.primary} name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="commission" fill={CHART_COLORS.secondary} name="Commission" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

