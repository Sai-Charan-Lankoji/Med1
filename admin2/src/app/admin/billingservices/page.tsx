"use client"

import { useState } from "react"
import { DollarSign, Calendar, CreditCard, TrendingUp, Search, Loader2, AlertCircle } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import withAuth from "@/lib/withAuth"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BillingRecord {
  id: string
  vendor_name: string
  current_bill: number
  paid_amount: number
  due_date: string
  status: 'paid' | 'pending' | 'overdue'
  projected_bill: number
}

// This would come from your actual API
const mockBillingData: BillingRecord[] = [
  {
    id: "1",
    vendor_name: "Tech Solutions Inc",
    current_bill: 299.99,
    paid_amount: 299.99,
    due_date: "2024-02-15",
    status: "paid",
    projected_bill: 325.50
  },
  {
    id: "2",
    vendor_name: "Digital Services Co",
    current_bill: 499.99,
    paid_amount: 0,
    due_date: "2024-02-28",
    status: "pending",
    projected_bill: 550.00
  },
  {
    id: "3",
    vendor_name: "Cloud Systems Ltd",
    current_bill: 199.99,
    paid_amount: 0,
    due_date: "2024-01-31",
    status: "overdue",
    projected_bill: 199.99
  }
]

function BillingServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("february")
  
  // In real app, replace with actual API call
  const isLoading = false
  const error = null
  const data = mockBillingData

  const filteredBilling = data?.filter((record) =>
    record.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const totalCurrentBills = filteredBilling.reduce((sum, record) => sum + record.current_bill, 0)
  const totalPaidAmount = filteredBilling.reduce((sum, record) => sum + record.paid_amount, 0)
  const totalProjected = filteredBilling.reduce((sum, record) => sum + record.projected_bill, 0)
  const pendingPayments = filteredBilling.filter(record => record.status === 'pending' || record.status === 'overdue').length

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading billing data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="mt-4 text-sm text-destructive">Error fetching billing data</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Billing Services</CardTitle>
          <CardDescription>Track and manage vendor billing and payments</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <DollarSign className="h-6 w-6 text-blue-700 dark:text-blue-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Bills</p>
                    <h3 className="text-2xl font-bold">${totalCurrentBills.toFixed(2)}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <CreditCard className="h-6 w-6 text-green-700 dark:text-green-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                    <h3 className="text-2xl font-bold">${totalPaidAmount.toFixed(2)}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                    <TrendingUp className="h-6 w-6 text-purple-700 dark:text-purple-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Projected Next Month</p>
                    <h3 className="text-2xl font-bold">${totalProjected.toFixed(2)}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                    <Calendar className="h-6 w-6 text-orange-700 dark:text-orange-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                    <h3 className="text-2xl font-bold">{pendingPayments}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search vendors..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Billing Table */}
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Vendor</TableHead>
                  <TableHead>Current Bill</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Projected Next Bill</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBilling.map((record) => (
                  <TableRow key={record.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{record.vendor_name}</TableCell>
                    <TableCell>${record.current_bill.toFixed(2)}</TableCell>
                    <TableCell>${record.paid_amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(record.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
                    <TableCell>${record.projected_bill.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: BillingRecord['status'] }) {
  const variants = {
    paid: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800",
    pending: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800",
    overdue: "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100 border-red-200 dark:border-red-800",
  }

  const statusText = {
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue"
  }

  return (
    <Badge 
      variant="outline"
      className={`font-semibold ${variants[status]}`}
    >
      {statusText[status]}
    </Badge>
  )
}

export default withAuth(BillingServicesPage)

