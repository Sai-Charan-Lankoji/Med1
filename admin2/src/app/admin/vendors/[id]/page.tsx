"use client";

import { useParams, useRouter } from "next/navigation";
import {
  User,
  Phone,
  Briefcase,
  CreditCardIcon,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { BackButton } from "@/app/utils/backButton";
import { useGetVendor } from "@/app/hooks/vendors/useGetVendor";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { motion } from "framer-motion";
import { LoadingDots } from "@/app/components/ui/Loding";
import { ChevronLeft } from "lucide-react";

export default function VendorDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const vendorId = params?.id as string;
  const { data: vendor, isLoading, error } = useGetVendor(vendorId);
  const { data: stores } = useGetStores(vendorId);

  if (isLoading) {
    return <LoadingDots message="Fetching vendor details..." />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <div className="rounded-full bg-red-100 dark:bg-red-900 p-4">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-300" />
        </div>
        <p className="text-base text-red-600 dark:text-red-400">
          Error fetching vendor data: {(error as any).message || "Unknown error"}
        </p>
      </div>
    );
  }

  const handleDetails = () => {
    router.push("/admin/vendors");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-10">
      <div className="container mx-auto px-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackButton
            name="Vendors"
            onClick={handleDetails}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-6"
            icon={<ChevronLeft className="h-4 w-4" />}
          />
          <Card className="border-none shadow-xl bg-white/95 dark:bg-gray-800/95 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6">
              <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-100">Vendor Details</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base mt-2">
                Detailed information about {vendor?.company_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Vendor Metrics */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="border-none shadow-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
                        <User className="h-6 w-6 text-blue-700 dark:text-blue-100" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Contact Name</p>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{vendor?.contact_name}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border-none shadow-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                        <Phone className="h-6 w-6 text-green-700 dark:text-green-100" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Phone</p>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{vendor?.contact_phone_number || "N/A"}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="border-none shadow-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3">
                        <Briefcase className="h-6 w-6 text-purple-700 dark:text-purple-100" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Business Type</p>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{vendor?.business_type}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="border-none shadow-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-3">
                        <CreditCardIcon className="h-6 w-6 text-orange-700 dark:text-orange-100" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Plan</p>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 capitalize">{vendor?.plan}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Address Information */}
              <Card className="border-none shadow-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Address Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-8 relative">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Vendor Address</h3>
                      <address className="not-italic text-gray-700 dark:text-gray-300 text-sm">
                        <p>{vendor?.vendorAddress?.address_1}</p>
                        {vendor?.vendorAddress?.address_2 && <p>{vendor?.vendorAddress?.address_2}</p>}
                        <p>
                          {vendor?.vendorAddress?.city}, {vendor?.vendorAddress?.province}{" "}
                          {vendor?.vendorAddress?.postal_code}
                        </p>
                        <p className="mt-2">Phone: {vendor?.vendorAddress?.phone || "N/A"}</p>
                      </address>
                    </div>
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Registration Address</h3>
                      <address className="not-italic text-gray-700 dark:text-gray-300 text-sm">
                        <p>{vendor?.registrationAddress?.address_1}</p>
                        {vendor?.registrationAddress?.address_2 && <p>{vendor?.registrationAddress?.address_2}</p>}
                        <p>
                          {vendor?.registrationAddress?.city}, {vendor?.registrationAddress?.province}{" "}
                          {vendor?.registrationAddress?.postal_code}
                        </p>
                        <p className="mt-2">Phone: {vendor?.registrationAddress?.phone || "N/A"}</p>
                      </address>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Store Information */}
              <Card className="border-none shadow-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Store Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {stores && stores.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <TableHead className="text-gray-700 dark:text-gray-200 font-semibold py-4">Name</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-200 font-semibold py-4">Created At</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-200 font-semibold py-4">Store Type</TableHead>
                          <TableHead className="text-gray-700 dark:text-gray-200 font-semibold py-4">Store URL</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stores.map((store, index) => (
                          <motion.tr
                            key={store.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700"
                          >
                            <TableCell className="font-medium text-gray-800 dark:text-gray-200 py-4">{store.name}</TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300 py-4">
                              {new Date(store?.createdAt).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </TableCell>
                            <TableCell className="text-gray-700 dark:text-gray-300 py-4">{store?.store_type || "N/A"}</TableCell>
                            <TableCell className="py-4">
                              <a
                                href={store.store_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 underline"
                              >
                                {store.store_url}
                              </a>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No store data available.</p>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}