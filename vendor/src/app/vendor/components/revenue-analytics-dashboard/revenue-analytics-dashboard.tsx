"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TotalRevenueChart } from "@/app/vendor/components/charts/total-revenue-chart"
import { CommissionBreakdownChart } from "../charts/commission-breakdown-chart"
import { StoreRevenueChart } from "../charts/store-revenue-chart"
import { InvoicesTable } from "../invoice/invoices-table" 



export function RevenueAnalyticsDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Revenue Analytics Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <TotalRevenueChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Commission Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <CommissionBreakdownChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Final Payout Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">$8,750.00</div>
            <p className="text-sm text-muted-foreground">After deductions</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Store-wise Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <StoreRevenueChart />
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Pending Invoices & Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoicesTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 


