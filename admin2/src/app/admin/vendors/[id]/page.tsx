"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DollarSign, Calendar, CreditCard, TrendingUp, Search, Loader2, AlertCircle, Store, User, Phone, Briefcase, CreditCardIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
import { useGetVendor } from "@/app/hooks/vendors/useGetVendor"
import { useGetStores } from "@/app/hooks/store/useGetStores"
import { BackButton } from "@/app/utils/backButton"

export default function VendorDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const vendorId = params?.id as string
  const { data: vendor, isLoading, error } = useGetVendor(vendorId)
  const { data: stores } = useGetStores(vendorId)

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading vendor data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="mt-4 text-sm text-destructive">Error fetching vendor data</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BackButton name="Vendors" className="text-indigo-600 hover:text-indigo-800 transition-colors mb-4" />
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Vendor Details</CardTitle>
          <CardDescription>Detailed information about {vendor?.vendor.company_name}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Vendor Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <User className="h-6 w-6 text-blue-700 dark:text-blue-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Name</p>
                    <h3 className="text-lg font-bold">{vendor?.vendor.contact_name}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <Phone className="h-6 w-6 text-green-700 dark:text-green-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <h3 className="text-lg font-bold">{vendor?.vendor.contact_phone_number}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                    <Briefcase className="h-6 w-6 text-purple-700 dark:text-purple-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Type</p>
                    <h3 className="text-lg font-bold">{vendor?.vendor.business_type}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                    <CreditCardIcon className="h-6 w-6 text-orange-700 dark:text-orange-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                    <h3 className="text-lg font-bold capitalize">{vendor?.vendor.plan}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Address Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 relative">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Vendor Address</h3>
                  <address className="not-italic">
                    <p>{vendor?.vendorAddress.address_1}</p>
                    {vendor?.vendorAddress.address_2 && <p>{vendor?.vendorAddress.address_2}</p>}
                    <p>{vendor?.vendorAddress.city}, {vendor?.vendorAddress.province} {vendor?.vendorAddress.postal_code}</p>
                    <p className="mt-2">Phone: {vendor?.vendorAddress.phone}</p>
                  </address>
                </div>
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200"></div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Registration Address</h3>
                  <div className="not-italic text-sm">
                    <p>{vendor?.registrationAddress.address_1}</p>
                    {vendor?.registrationAddress.address_2 && <p>{vendor?.registrationAddress.address_2}</p>}
                    <p>{vendor?.registrationAddress.city}, {vendor?.registrationAddress.province} {vendor?.registrationAddress.postal_code}</p>
                    <p className="mt-2">Phone: {vendor?.registrationAddress.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Information */}
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent>
              {stores && stores.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Store Type</TableHead>
                      <TableHead>Store URL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stores.map((store) => (
                      <TableRow key={store.id}>
                        <TableCell className="font-medium">{store.name}</TableCell>
                        <TableCell>{new Date(store.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                        <TableCell>{store.store_type}</TableCell>
                        <TableCell>
                          <a href={store.store_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {store.store_url}
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No store data available.</p>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

