"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOverallVendorAnalytics } from "@/app/hooks/vendor-revenue/useGetTotalVendorRevenue";
import { useGetVendors } from "@/app/hooks/vendors/useGetVendors";
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
} from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { AnimatedCounter } from "@/app/components/ui/animated-counter";
import { motion } from "framer-motion";
import { LoadingDots, ErrorMessage } from "@/app/components/ui/Loding";

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
  const [isNotifying, setIsNotifying] = useState(false);

  const handleNotify = async () => {
    setIsNotifying(true);
    try {
      const response = await fetch("http://localhost:5000/api/vendors/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: "all" }),
      });
      if (!response.ok) throw new Error("Failed to send notification");
      alert("Notification sent successfully!");
    } catch (err) {
      alert(`Error sending notification: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsNotifying(false);
    }
  };

  const vendors: Vendor[] = vendorsData?.vendors || [];

  if (overallLoading || vendorsLoading) {
    return <LoadingDots message="Fetching billing data..." />;
  }

  if (overallError || vendorsError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <ErrorMessage error={overallErrorObj || vendorsErrorObj} />
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

  const statsCards = [
    {
      title: "Total Vendors",
      value: overallData.total_vendors,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900",
      formatValue: (val: number) => val.toLocaleString(),
    },
    {
      title: "Total Orders",
      value: overallData.total_orders,
      icon: ShoppingCart,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900",
      formatValue: (val: number) => val.toLocaleString(),
    },
    {
      title: "Total Vendor Revenue",
      value: parseFloat(overallData.total_vendor_revenue),
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900",
      formatValue: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: "Total Admin Commission",
      value: parseFloat(overallData.total_admin_commission),
      icon: Percent,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900",
      formatValue: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: "Commissionable Orders",
      value: overallData.commission_total_orders,
      icon: ShoppingCart,
      color: "text-teal-600",
      bg: "bg-teal-100 dark:bg-teal-900",
      formatValue: (val: number) => val.toLocaleString(),
    },
    {
      title: "Non-Commissionable Revenue",
      value: parseFloat(overallData.non_commissionable_revenue),
      icon: DollarSign,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-900",
      formatValue: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      title: "Final Vendor Revenue",
      value: parseFloat(overallData.final_vendor_revenue),
      icon: DollarSign,
      color: "text-indigo-600",
      bg: "bg-indigo-100 dark:bg-indigo-900",
      formatValue: (val: number) => `$${val.toLocaleString()}`,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-none shadow-xl bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          <CardHeader className="relative bg-gradient-to-r from-gray-100 to-white p-6">
            <CardTitle className="text-4xl font-bold text-gray-900">Billing Services</CardTitle>
            <CardDescription className="text-gray-600 text-sm mt-2">
              Overall financial summary and vendor details
            </CardDescription>
            {/* Uncomment if you want the Notify button */}
            {/* <Button
              onClick={handleNotify}
              disabled={isNotifying}
              className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 shadow-md"
            >
              <Bell className={`h-4 w-4 ${isNotifying ? "animate-pulse" : ""}`} />
              {isNotifying ? "Notifying..." : "Notify All"}
            </Button> */}
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-md min-h-[140px]">
                    <CardContent className="p-8 flex items-center gap-6">
                      <div className={`rounded-full ${stat.bg} p-4`}>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-base text-gray-600 font-semibold">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                          <AnimatedCounter value={stat.value} duration={1.5} formatValue={stat.formatValue} />
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="rounded-xl border shadow-md bg-white/70 backdrop-blur-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 hover:bg-gray-100 border-b border-gray-200">
                    <TableHead className="text-gray-700 font-semibold">Company Name</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Contact Name</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Contact Email</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Plan</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Business Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor: Vendor) => (
                    <TableRow
                      key={vendor.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100"
                      onClick={() => handleVendorClick(vendor.id)}
                    >
                      <TableCell className="font-medium text-gray-800">{vendor.company_name}</TableCell>
                      <TableCell className="text-gray-700">{vendor.contact_name}</TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">{vendor.contact_email}</TableCell>
                      <TableCell className="text-gray-700">{vendor.plan}</TableCell>
                      <TableCell className="text-gray-700">{vendor.business_type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BillingServicesPage;