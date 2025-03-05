"use client";

import { useVendorSpecificAnalytics } from "@/app/hooks/vendor-revenue/useGetTotalVendorRevenue";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Loader2,
  AlertCircle,
  TrendingUp,
  Store,
  DollarSign,
  ShoppingCart,
  Bell,
  ChevronLeft,
} from "lucide-react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { ChartContainer } from "@/app/components/ui/chart";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { AnimatedCounter } from "@/app/components/ui/animated-counter";
import { BackButton } from "@/app/utils/backButton";
import { LoadingDots, ErrorMessage } from "@/app/components/ui/Loding";

const VendorAnalyticsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useVendorSpecificAnalytics(id);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [isNotifying, setIsNotifying] = useState(false);

  const handleNotify = async () => {
    setIsNotifying(true);
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "active" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed: ${response.status}`);
      }

      const result = await response.json();
      setNotificationStatus(`Notification sent: ${result.message}`);
      setTimeout(() => setNotificationStatus(null), 3000);
    } catch (err) {
      setNotificationStatus(`Error: ${err instanceof Error ? err.message : "Unknown"}`);
      setTimeout(() => setNotificationStatus(null), 3000);
    } finally {
      setIsNotifying(false);
    }
  };

  const retryFetch = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <LoadingDots message="Fetching vendor analytics..." />;
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <ErrorMessage error={error} />
        <Button variant="outline" onClick={retryFetch} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground">No vendor data available</p>
      </div>
    );
  }

  const totalRevenue = data.stores.reduce((acc, store) => acc + store.total_revenue, 0);
  const totalCommission = data.stores.reduce((acc, store) => acc + store.total_commission, 0);
  const totalOrders = data.stores.reduce((acc, store) => acc + store.orders_count, 0);

  const statsCards = [
    { title: "Total Revenue", value: totalRevenue, icon: DollarSign, color: "text-green-600", formatValue: (val: number) => `$${val.toLocaleString()}` },
    { title: "Total Admin Commission", value: totalCommission, icon: TrendingUp, color: "text-blue-600", formatValue: (val: number) => `$${val.toLocaleString()}` },
    { title: "Total Orders", value: totalOrders, icon: ShoppingCart, color: "text-purple-600", formatValue: (val: number) => val.toLocaleString() },
    { title: "Active Stores", value: data.stores.length, icon: Store, color: "text-orange-600", formatValue: (val: number) => val.toLocaleString() },
    { title: "Net Vendor Revenue", value: totalRevenue - totalCommission, icon: DollarSign, color: "text-yellow-600", formatValue: (val: number) => `$${val.toLocaleString()}` },
  ];

  const chartConfig = {
    revenue: { label: "Revenue", color: "#4ade80" },
    commission: { label: "Commission", color: "#3b82f6" },
  };

  const customTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-gray-900 text-white p-3 shadow-lg text-sm">
          <div className="font-semibold mb-2">{label}</div>
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span>
                {item.name}: <span className="font-medium">${Number(item.value).toLocaleString()}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <BackButton
          name="Billing Service"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-6"
          icon={<ChevronLeft className="h-4 w-4" />}
        />
        <Card className="border-none shadow-xl bg-gradient-to-br from-primary/10 to-background overflow-hidden">
          <CardHeader className="relative bg-gradient-to-r from-primary/20 to-background p-6">
            <CardTitle className="text-4xl font-bold text-gray-900">Vendor Analytics</CardTitle>
            <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-700">
              <span className="px-4 py-1 rounded-full bg-primary/20 text-primary font-medium">ID: {data.vendor_id}</span>
              <span className="px-4 py-1 rounded-full bg-primary/20 text-primary font-medium">
                Commission Rate: {data.commission_rate}
              </span>
              <span className="px-4 py-1 rounded-full bg-primary/20 text-primary font-medium">
                Next Billing: {new Date(data.next_billing_date).toLocaleDateString()}
              </span>
            </CardDescription>
            <Button
              onClick={handleNotify}
              disabled={isNotifying}
              className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-md"
            >
              <Bell className={`h-4 w-4 ${isNotifying ? "animate-pulse" : ""}`} />
              {isNotifying ? "Notifying..." : "Notify for Payment"}
            </Button>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {notificationStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-sm p-3 rounded-lg shadow-inner ${notificationStatus.includes("Error") ? "text-red-600 bg-red-100" : "text-green-600 bg-green-100"}`}
              >
                {notificationStatus}
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-800">
                            <AnimatedCounter value={stat.value} duration={1.5} formatValue={stat.formatValue} />
                          </p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">Store Revenue & Commission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[350px]">
                      <BarChart
                        data={data.stores.map((store) => ({
                          name: store.store_name,
                          revenue: store.total_revenue,
                          commission: store.total_commission,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <Tooltip content={customTooltip} cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
                        <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />
                        <Bar
                          dataKey="revenue"
                          fill={chartConfig.revenue.color}
                          barSize={30}
                          animationDuration={1000}
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="commission"
                          fill={chartConfig.commission.color}
                          barSize={30}
                          animationDuration={1000}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-none shadow-md bg-white/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">Monthly Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--chart-3))" } }} className="h-[350px]">
                      <AreaChart
                        data={data.monthly_revenue.map((item) => ({
                          month: item.month,
                          revenue: Number.parseFloat(item.revenue),
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                        <Tooltip content={customTooltip} cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
                        <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--chart-3))"
                          fill="hsl(var(--chart-3))"
                          fillOpacity={0.3}
                          animationDuration={1000}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VendorAnalyticsPage;