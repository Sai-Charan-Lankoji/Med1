"use client";

import { useState } from "react";
import { useGetVendors } from "@/app/hooks/vendors/useGetVendors";
import { Input } from "@/components/ui/input";
import { Search, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LoadingDots } from "@/components/ui/Loding";

interface Vendor {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  plan: string;
  business_type: string;
}

function VendorsPage() {
  const { data, error, isLoading } = useGetVendors();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredVendors = data?.vendors?.filter((vendor: Vendor) =>
    vendor.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return <LoadingDots message="Fetching vendors..." />;
  }

  const handleDetails = (id: string) => {
    router.push(`/admin/vendors/${id}`);
  };

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <div className="rounded-full bg-red-100 dark:bg-red-900 p-4">
          <Building2 className="h-8 w-8 text-red-600 dark:text-red-300" />
        </div>
        <p className="text-base text-red-600 dark:text-red-400">
          Error fetching vendors: {(error as { message: string }).message || "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-10">
      <div className="container mx-auto px-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-xl bg-white/95 dark:bg-gray-800/95 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6">
              <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-100">Vendors</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base mt-2">
                Manage and view all your vendors in one place
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search vendors..."
                    className="pl-10 pr-4 py-2 rounded-full border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-gray-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredVendors.length === 0 ? (
                <div className="text-center py-16">
                  <Building2 className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">No vendors found</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {data?.vendors?.length === 0
                      ? "No vendors have been added yet."
                      : "Try adjusting your search term."}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border shadow-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <TableHead className="text-gray-700 dark:text-gray-200 font-semibold py-4">Company Name</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-200 font-semibold py-4">Contact Name</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-200 font-semibold py-4">Contact Email</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-200 font-semibold py-4">Plan</TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-200 font-semibold py-4">Business Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendors.map((vendor: Vendor) => (
                        <motion.tr
                          key={vendor.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700"
                          onClick={() => handleDetails(vendor.id)}
                        >
                          <TableCell className="font-medium text-gray-800 dark:text-gray-200 py-4">{vendor.company_name}</TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300 py-4">{vendor.contact_name}</TableCell>
                          <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400 py-4">{vendor.contact_email}</TableCell>
                          <TableCell className="py-4">
                            <PlanBadge plan={vendor.plan} />
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                              {vendor.business_type}
                            </span>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const variants = {
    premium: "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800",
    pro: "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800",
    basic: "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
  } as const;

  const variant = variants[plan?.toLowerCase() as keyof typeof variants] || 
    "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700";

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold px-2.5 py-1 rounded-full transition-colors duration-200",
        variant,
        "hover:bg-opacity-80"
      )}
    >
      {plan}
    </Badge>
  );
}

export default VendorsPage;