"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOverallVendorAnalytics } from "@/app/hooks/vendor-revenue/useGetTotalVendorRevenue"; // Adjust path
import { useGetVendors } from "@/app/hooks/vendors/useGetVendors"; // Adjust path if needed
import {
  DollarSign,
  ShoppingCart,
  Users,
  Percent,
  Loader2,
  AlertCircle,
  Bell,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Interface for vendor data from useGetVendors
interface Vendor {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  plan: string;
  business_type: string;
}

interface VendorsResponse {
  vendors: Vendor[];
}

const BillingServicesPage = () => {
  const { data: overallData, isLoading: overallLoading, isError: overallError, error: overallErrorObj } = useOverallVendorAnalytics();
  const { data: vendorsData, isLoading: vendorsLoading, isError: vendorsError, error: vendorsErrorObj } = useGetVendors();
  const router = useRouter();

  // Notify handler (placeholder)
  // const handleNotify = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/vendors/notify", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ vendorId: "all" }), // Adjust as needed
  //     });
  //     if (!response.ok) throw new Error("Failed to send notification");
  //     alert("Notification sent successfully!");
  //   } catch (err) {
  //     alert(`Error sending notification: ${err instanceof Error ? err.message : "Unknown error"}`);
  //   }
  // };

  const vendors: Vendor[] = vendorsData?.vendors || [];

  if (overallLoading || vendorsLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  if (overallError || vendorsError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="mt-4 text-sm text-destructive">
          Error fetching data: {((overallErrorObj as Error) || (vendorsErrorObj as Error))?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  if (!overallData || vendors.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  const handleVendorClick = (id: string) => {
    router.push(`/admin/billingservices/${id}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader className="relative">
          <CardTitle className="text-3xl font-bold">Billing Services</CardTitle>
          <CardDescription>Overall financial summary and vendor details</CardDescription>
          {/* <Button
            onClick={handleNotify}
            className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700"
          >
            <Bell className="h-4 w-4 mr-2" /> Notify
          </Button> */}
        </CardHeader>
        <CardContent>
          {/* Overall Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                    <Users className="h-6 w-6 text-blue-700 dark:text-blue-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Vendors</p>
                    <h3 className="text-2xl font-bold">{overallData.total_vendors}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                    <ShoppingCart className="h-6 w-6 text-green-700 dark:text-green-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <h3 className="text-2xl font-bold">{overallData.total_orders}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                    <DollarSign className="h-6 w-6 text-purple-700 dark:text-purple-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Vendor Revenue</p>
                    <h3 className="text-2xl font-bold">
                      ${parseFloat(overallData.total_vendor_revenue).toFixed(2)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                    <Percent className="h-6 w-6 text-orange-700 dark:text-orange-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Admin Commission</p>
                    <h3 className="text-2xl font-bold">
                      ${parseFloat(overallData.total_admin_commission).toFixed(2)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Additional Cards */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-teal-100 p-3 dark:bg-teal-900">
                    <ShoppingCart className="h-6 w-6 text-teal-700 dark:text-teal-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Commissionable Orders
                    </p>
                    <h3 className="text-2xl font-bold">
                      {overallData.commission_total_orders}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                    <DollarSign className="h-6 w-6 text-red-700 dark:text-red-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Non-Commissionable Revenue
                    </p>
                    <h3 className="text-2xl font-bold">
                      ${parseFloat(overallData.non_commissionable_revenue).toFixed(2)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900">
                    <DollarSign className="h-6 w-6 text-indigo-700 dark:text-indigo-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Final Vendor Revenue
                    </p>
                    <h3 className="text-2xl font-bold">
                      ${parseFloat(overallData.final_vendor_revenue).toFixed(2)}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vendor Table */}
          <div className="rounded-lg border shadow-sm mb-8">
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
                {vendors.map((vendor: Vendor) => (
                  <TableRow
                    key={vendor.id}
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleVendorClick(vendor.id)}
                  >
                    <TableCell className="font-medium">{vendor.company_name}</TableCell>
                    <TableCell>{vendor.contact_name}</TableCell>
                    <TableCell className="font-mono text-sm">{vendor.contact_email}</TableCell>
                    <TableCell>{vendor.plan}</TableCell>
                    <TableCell>{vendor.business_type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingServicesPage;