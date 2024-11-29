"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Container,
  Table,
} from "@medusajs/ui";
import {
  ChevronDownMini,
  ChevronUpMini,
} from "@medusajs/icons";
import Pagination from "@/app/utils/pagination";
import { BackButton } from "@/app/utils/backButton";
import {useGetVendor} from "@/app/hooks/vendors/useGetVendor"; 
import {useGetStores} from "@/app/hooks/store/useGetStores"


const CustomerDetails = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showRawData, setShowRawData] = useState(false);
  const router = useRouter()
  const params = useParams(); 
  const vendorId = params?.id as string | any |  undefined; 
  const { data: vendor } = useGetVendor(vendorId);  
  const {data : stores}  = useGetStores(vendorId) 
  console.log("this are stores : ",stores) 

  


  const pageSize = 5;

  

  return (
    <div className="min-h-screen   overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackButton name="Customers" className="text-indigo-600 hover:text-indigo-800 transition-colors" />
        
        {!vendor ? (
          <CustomerDetailsSkeleton />
        ) : (
          <>
            {/* Customer Profile Card */}
            <div className="bg-white/10 backdrop-blur-md  rounded-xl shadow-2xl ">
              <div className="p-8">
                <div className="flex items-center space-x-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
                    {vendor?.vendor?.contact_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-900">
                      {vendor.first_name} {vendor.last_name}
                    </h2>
                    <p className="text-indigo-600 mt-1">{vendor.email}</p>
                  </div>
                </div>

                <div className="mt-8 flex divide-x divide-indigo-200">
                  <div className="px-6 first:pl-0">
                    <p className="text-sm font-medium text-indigo-400">First seen</p>
                    <p className="mt-1 text-indigo-900">
                      {new Date(vendor?.vendor?.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="px-6">
                    <p className="text-sm font-medium text-indigo-400">Phone</p>
                    <p className="mt-1 text-indigo-900">{vendor?.vendor?.contact_phone_number || "Not provided"}</p>
                  </div>
                  <div className="px-6">
                    <p className="text-sm font-medium text-indigo-400">Total Orders</p>
                    <p className="mt-1 text-indigo-900">{vendor?.length || 0}</p>
                  </div>
                  <div className="px-6">
                    <p className="text-sm font-medium text-indigo-400">Account Status</p>
                    <div className="mt-1 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        vendor.has_account ? "bg-green-500" : "bg-red-500"
                      }`} />
                      <span className="text-indigo-900">
                        {vendor.has_account ? "Registered" : "Guest"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;

const CustomerDetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden p-8">
      <div className="animate-pulse">
        <div className="flex items-center space-x-6">
          <div className="bg-indigo-200 rounded-2xl h-20 w-20"></div>
          <div className="space-y-3">
            <div className="h-6 bg-indigo-200 rounded w-48"></div>
            <div className="h-4 bg-indigo-200 rounded w-64"></div>
          </div>
        </div>

        <div className="mt-8 flex divide-x divide-indigo-200">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-6 first:pl-0 space-y-3">
              <div className="h-4 bg-indigo-200 rounded w-20"></div>
              <div className="h-4 bg-indigo-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
      <div className="p-6 border-b border-indigo-100">
        <div className="h-6 bg-indigo-200 rounded w-32"></div>
        <div className="h-4 bg-indigo-200 rounded w-48 mt-2"></div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-8 bg-indigo-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

