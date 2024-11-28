"use client"

import { useState } from "react"
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button" 
import withAuth from "@/lib/withAuth";
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

interface Vendor {
  id: string
  company_name: string
  contact_name: string
  contact_email: string
  plan: string
  business_type: string
}

 function VendorsPage() {
  const { data, error, isLoading } = useGetCustomers()
  const [searchTerm, setSearchTerm] = useState("")

  if (isLoading) return <p className="text-center p-4">Loading vendors...</p>
  if (error) return <p className="text-center p-4 text-red-500">Error fetching vendors: {error.message}</p>

  const filteredVendors = data?.vendors?.filter((vendor: Vendor) =>
    vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Vendors</CardTitle>
          <CardDescription>Manage and view all your vendors in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Input
              type="text"
              placeholder="Search by company name..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button>Add New Vendor</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Business Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor: Vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.company_name}</TableCell>
                      <TableCell>{vendor.contact_name}</TableCell>
                      <TableCell>{vendor.contact_email}</TableCell>
                      <TableCell>
                        <PlanBadge plan={vendor.plan} />
                      </TableCell>
                      <TableCell>{vendor.business_type}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No vendors found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  const planLower = plan.toLowerCase()
  let badgeClass = ""

  switch (planLower) {
    case "premium":
      badgeClass = "bg-purple-100 text-purple-800 hover:bg-purple-200"
      break
    case "pro":
      badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-200"
      break
    case "basic":
      badgeClass = "bg-green-100 text-green-800 hover:bg-green-200"
      break
    default:
      badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }

  return (
    <Badge className={`${badgeClass} font-semibold`} variant="outline">
      {plan}
    </Badge>
  )
}  

export default withAuth(VendorsPage)

