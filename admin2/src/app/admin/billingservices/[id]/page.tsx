"use client"

import { useVendorSpecificAnalytics } from "@/app/hooks/vendor-revenue/useGetTotalVendorRevenue"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, TrendingUp, Store, DollarSign, ShoppingCart } from "lucide-react"
import { Bar, Area } from "recharts"
import { motion } from "framer-motion"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const VendorAnalyticsPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useVendorSpecificAnalytics(id)

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading vendor analytics...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="mt-4 text-sm text-destructive">Error fetching vendor analytics: {error?.message}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground">No vendor data available</p>
      </div>
    )
  }

  const totalRevenue = data.stores.reduce((acc, store) => acc + store.total_revenue, 0)
  const totalCommission = data.stores.reduce((acc, store) => acc + store.total_commission, 0)
  const totalOrders = data.stores.reduce((acc, store) => acc + store.orders_count, 0)

  const statsCards = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Total Commission",
      value: `$${totalCommission.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "text-purple-500",
    },
    {
      title: "Active Stores",
      value: data.stores.length,
      icon: Store,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Vendor Analytics</CardTitle>
            <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">ID: {data.vendor_id}</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                Commission Rate: {data.commission_rate}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                Next Billing: {new Date(data.next_billing_date).toLocaleDateString()}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Store Revenue Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Store Revenue and Commission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        revenue: {
                          label: "Revenue",
                          color: "hsl(var(--chart-1))",
                        },
                        commission: {
                          label: "Commission",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <Bar
                        data={data.stores.map((store) => ({
                          name: store.store_name,
                          revenue: store.total_revenue,
                          commission: store.total_commission,
                        }))}
                        layout="vertical"
                      >
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </Bar>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Monthly Revenue Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Monthly Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        revenue: {
                          label: "Revenue",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <Area
                        data={data.monthly_revenue.map((item) => ({
                          month: item.month,
                          revenue: Number.parseFloat(item.revenue),
                        }))}
                      >
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </Area>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default VendorAnalyticsPage

