"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Container,
  Table,
  Text,
  Heading,
} from "@medusajs/ui";
import {
  ChevronDownMini,
  ChevronUpMini,
} from "@medusajs/icons";
import Pagination from "@/app/utils/pagination";
import { BackButton } from "@/app/utils/backButton";
import { useGetVendor } from "@/app/hooks/vendors/useGetVendor"; 
import { useGetStores } from "@/app/hooks/store/useGetStores"

const CustomerDetails = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showRawData, setShowRawData] = useState(false);
  const router = useRouter()
  const params = useParams(); 
  const vendorId = params?.id as string | any |  undefined; 
  const { data: vendor } = useGetVendor(vendorId);  
  const { data: stores } = useGetStores(vendorId) 

  const pageSize = 5;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackButton name="Vendors" className="text-indigo-600 hover:text-indigo-800 transition-colors" />
        
        {!vendor ? (
          <CustomerDetailsSkeleton />
        ) : (
          <>
            {/* Vendor Profile Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl">
              <div className="p-8">
                <div className="flex items-center space-x-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
                    {vendor.vendor.contact_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-indigo-900">
                      {vendor.vendor.company_name}
                    </h2>
                    <p className="text-indigo-600 mt-1">{vendor.vendor.contact_email}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap divide-x divide-indigo-200">
                  <div className="px-6 first:pl-0 mb-4">
                    <p className="text-sm font-medium text-indigo-400">Contact Name</p>
                    <p className="mt-1 text-indigo-900">{vendor.vendor.contact_name}</p>
                  </div>
                  <div className="px-6 mb-4">
                    <p className="text-sm font-medium text-indigo-400">Phone</p>
                    <p className="mt-1 text-indigo-900">{vendor.vendor.contact_phone_number}</p>
                  </div>
                  <div className="px-6 mb-4">
                    <p className="text-sm font-medium text-indigo-400">Business Type</p>
                    <p className="mt-1 text-indigo-900">{vendor.vendor.business_type}</p>
                  </div>
                  <div className="px-6 mb-4">
                    <p className="text-sm font-medium text-indigo-400">Plan</p>
                    <p className="mt-1 text-indigo-900 capitalize">{vendor.vendor.plan}</p>
                  </div>
                  <div className="px-6 mb-4">
                    <p className="text-sm font-medium text-indigo-400">Registered</p>
                    <p className="mt-1 text-indigo-900">
                      {new Date(vendor.vendor.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <Heading level="h2" className="text-2xl font-bold text-indigo-900 mb-4">Address Information</Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Vendor Address</h3>
                  <p>{vendor.vendorAddress.address_1}</p>
                  <p>{vendor.vendorAddress.address_2}</p>
                  <p>{vendor.vendorAddress.city}, {vendor.vendorAddress.province} {vendor.vendorAddress.postal_code}</p>
                  <p>{vendor.vendorAddress.phone}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Registration Address</h3>
                  <p>{vendor.registrationAddress.address_1}</p>
                  <p>{vendor.registrationAddress.address_2}</p>
                  <p>{vendor.registrationAddress.city}, {vendor.registrationAddress.province} {vendor.registrationAddress.postal_code}</p>
                  <p>{vendor.registrationAddress.phone}</p>
                </div>
              </div>
            </div>

            {/* Store Data Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <Heading level="h2" className="text-2xl font-bold text-indigo-900 mb-4">Store Information</Heading>
              {stores && stores.length > 0 ? (
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Name</Table.HeaderCell>
                      <Table.HeaderCell>Created At</Table.HeaderCell>
                      <Table.HeaderCell>Updated At</Table.HeaderCell>
                      <Table.HeaderCell>Currency</Table.HeaderCell>
                      <Table.HeaderCell>Store Type</Table.HeaderCell>
                      <Table.HeaderCell>Store URL</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {stores.map((store) => (
                      <Table.Row key={store.id}>
                        <Table.Cell>{store.name}</Table.Cell>
                        <Table.Cell>{formatDate(store.created_at)}</Table.Cell>
                        <Table.Cell>{formatDate(store.updated_at)}</Table.Cell>
                        <Table.Cell>{store.default_currency_code.toUpperCase()}</Table.Cell>
                        <Table.Cell>{store.store_type}</Table.Cell>
                        <Table.Cell>
                          <a href={store.store_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                            {store.store_url}
                          </a>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <Text>No store data available.</Text>
              )}
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
          {[1, 2, 3, 4, 5].map((i) => (
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

