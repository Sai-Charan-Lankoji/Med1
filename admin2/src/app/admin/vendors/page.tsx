"use client"

import { useState } from "react"
import { useGetVendors } from "@/app/hooks/vendors/useGetVendors"
import { Input } from "@/components/ui/input"

import { Search, Loader2, Building2 } from 'lucide-react' 
import {useRouter} from "next/navigation"
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
import { cn } from "@/lib/utils"

interface Vendor {
  id: string
  company_name: string
  contact_name: string
  contact_email: string
  plan: string
  business_type: string
}

function VendorsPage() { 
  const { data, error, isLoading } = useGetVendors()
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredVendors = data?.vendors?.filter((vendor: Vendor) =>
    vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading vendors...</p>
      </div>
    )
  } 


  const handleDetails = (id: number | string) => {  
    router.push(`/admin/vendors/${id}`);  
};  


  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <Building2 className="h-6 w-6 text-destructive" />
        </div>
        <p className="mt-4 text-sm text-destructive">Error fetching vendors:</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Vendors</CardTitle>
          <CardDescription>Manage and view all your vendors in one place</CardDescription>
        </CardHeader>
        <CardContent>
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
          </div>

          {filteredVendors.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No vendors found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {data?.vendors?.length === 0
                  ? "Start by adding your first vendor."
                  : "Try adjusting your search term."}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact Name</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Business Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor: Vendor) => (
                    <TableRow key={vendor.id} className="hover:bg-muted/50 cursor-pointer" onClick= {() => handleDetails(vendor.id)}>
                      <TableCell className="font-medium">{vendor.company_name}</TableCell>
                      <TableCell>{vendor.contact_name}</TableCell>
                      <TableCell className="font-mono text-sm">{vendor.contact_email}</TableCell>
                      <TableCell>
                        <PlanBadge plan={vendor.plan} />
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                          {vendor.business_type}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  const variants = {
    premium: "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100 border-purple-200 dark:border-purple-800",
    pro: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800",
    basic: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800",
  } as const

  const variant = variants[plan?.toLowerCase() as keyof typeof variants] || 
    "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800"

  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-semibold transition-colors",
        variant
      )}
    >
      {plan}
    </Badge>
  )
}

export default VendorsPage

