"use client";

import {
  Badge,
  Button,
  Heading,
  Table,
  Tooltip,
  Select,
} from "@medusajs/ui";
import withAuth from "@/lib/withAuth";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@medusajs/ui";
import { Eye } from "@medusajs/icons";
import { useGetOrders } from "@/app/hooks/orders/useGetOrders";
import { useGetSalesChannels } from "@/app/hooks/saleschannel/useGetSalesChannels";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { useRouter } from "next/navigation";
import { getColors } from "@/app/utils/dummyData";
import Pagination from "@/app/utils/pagination";
import { FiSearch } from "react-icons/fi";
import { parseISO, format, parse, isValid } from "date-fns";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { motion, AnimatePresence } from "framer-motion";
import { TbReload } from "react-icons/tb";

const Order = () => {
  // Add refetch to the destructured values from useGetOrders
  const { data: OrdersData, isLoading, refetch } = useGetOrders();
  const { data: saleschannelsData } = useGetSalesChannels();
  const { data: customersData } = useGetCustomers();
  const { data: stores } = useGetStores();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStore, setSelectedStore] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const pageSize = 6;
  
  // Add manual trigger for data loading if initial load fails
  useEffect(() => {
    // If data is undefined but loading is complete, try refetching
    if (!OrdersData && !isLoading) {
      refetch();
    }
  }, [OrdersData, isLoading, refetch]);

  const getCustomerFirstName = useCallback((customerId: any) => {
    const customer = customersData?.find(
      (customer: { id: any }) => customer.id === customerId
    );
    return customer ? `${customer.first_name} ${customer.last_name}` : "N/A";
  }, [customersData]);

  // Improved refresh handler that uses refetch instead of page reload
  const handleFetchOrders = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refresh orders:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = parseISO(timestamp);
    return format(date, "dd MMM yyyy hh:mm a").toLocaleString();
  };

  const formatDate = (timestamp: string) => {
    const date = parseISO(timestamp);
    return format(date, "dd-MM-yyyy");
  };

  const parseDateString = (dateString: string) => {
    const formats = ['dd-MM-yyyy', 'yyyy-MM-dd', 'MM-dd-yyyy'];
    for (const formatString of formats) {
      const parsedDate = parse(dateString, formatString, new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }
    return null;
  };

  // Improved filtering logic with better null checks
  const filteredOrders = useMemo(() => {
    // Check if OrdersData exists
    if (!OrdersData) return [];
    
    // Handle different data structures
    let ordersArray;
    if (Array.isArray(OrdersData)) {
      ordersArray = OrdersData;
    } else if (OrdersData.data && Array.isArray(OrdersData.data)) {
      ordersArray = OrdersData.data;
    } else {
      return [];
    }
    
    const searchLower = searchQuery.toLowerCase();
    const searchDate = parseDateString(searchQuery);
  
    return ordersArray.filter((order) => {
      if (!order) return false;
      
      const orderDate = parseISO(order.createdAt);
      const matchesSearch = 
        getCustomerFirstName(order.customer_id)?.toLowerCase().includes(searchLower) ||
        (order.payment_status && order.payment_status.toLowerCase().includes(searchLower)) ||
        (order.status && order.status.toLowerCase().includes(searchLower)) ||
        (order.id && order.id.toLowerCase().includes(searchLower)) ||
        (order.email && order.email.toLowerCase().includes(searchLower)) ||
        (searchDate && format(orderDate, 'dd-MM-yyyy') === format(searchDate, 'dd-MM-yyyy'));
  
      const matchesStore = selectedStore === "all" || order.store_id === selectedStore;
  
      return matchesSearch && matchesStore;
    });
  }, [OrdersData, searchQuery, selectedStore, getCustomerFirstName]);

  const paginatedOrders = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, pageSize]);

  const getRowIndex = (index: number) => {
    return (currentPage * pageSize) + index + 1;
  };

  const getStoreName = (storeId: string) => {
    const store = stores?.find((s: any) => s.id === storeId);
    return store ? store.name : "N/A";
  };

  // Show loading state for both initial load and refresh
  if (isLoading || isRefreshing) {
    return <OrderSkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Heading level="h2" className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
          Orders
        </Heading>
      </motion.div>
      
      {/* Filter and search controls */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-8"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap space-x-0 sm:space-x-4 space-y-4 sm:space-y-0 w-full">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex flex-row items-center space-x-4 w-full sm:w-auto"
          >
            <Select
              value={selectedStore}
              onValueChange={(value) => setSelectedStore(value)}
            >
              <Select.Trigger className="select select-bordered w-full">
                <Select.Value placeholder="Select a store" />
              </Select.Trigger>
              <Select.Content className="bg-base-100 shadow">
                <Select.Item value="all">All Stores</Select.Item>
                {stores?.map((store: any) => (
                  <Select.Item key={store.id} value={store.id}>
                    {store.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex flex-row items-center space-x-4 w-full sm:w-auto"
          >
            <div className="relative w-full sm:w-auto">
              <div className="input input-bordered flex items-center gap-2">
                <FiSearch className="text-base-content/70" />
                <input
                  type="text"
                  placeholder="Search Orders"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="grow bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Orders table or empty state */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col gap-4"
      >
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="card bg-base-100 shadow-lg text-center py-8"
          >
            <div className="card-body items-center">
              <p className="text-base-content/70 mb-4">No Orders found.</p>
              <button
                onClick={handleFetchOrders}
                className="btn btn-primary gap-2"
              >
                <span>Refresh Data</span>
                <TbReload className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="text-center">Order</th>
                  <th className="text-center">Date Added</th>
                  <th>Customer</th>
                  <th className="text-center">Fulfillment</th>
                  <th className="text-center">Payment Status</th>
                  <th className="text-center">Store</th>
                  <th className="text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedOrders.map((order: any, index: any) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover"
                    >
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="btn btn-ghost btn-xs btn-circle"
                            onClick={() => router.push(`/vendor/orders/${order.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <span>{getRowIndex(index)}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="tooltip" data-tip={formatTimestamp(order.createdAt)}>
                          <span className="cursor-help">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className={`avatar placeholder`}
                          >
                            <div className={`w-8 text-base-100 ${getColors(index)}`}>
                              <span>{getCustomerFirstName(order.customer_id).charAt(0).toUpperCase()}</span>
                            </div>
                          </motion.div>
                          <span>{getCustomerFirstName(order.customer_id)}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge badge-ghost">
                          {order.fulfillment_status || "N/A"}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${order.payment_status === "captured" ? "badge-success" : "badge-warning"}`}>
                          {order.payment_status || "N/A"}
                        </span>
                      </td>
                      <td className="text-center">{getStoreName(order.store_id)}</td>
                      <td className="text-center">
                        <span className="font-medium">{order.total_amount}</span>{" "}
                        <span className="text-xs opacity-70">{order.currency_code?.toUpperCase()}</span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={filteredOrders.length}
              data={filteredOrders}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

const OrderSkeleton = () => {
  return (
    <div className="p-4">
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-base-200 rounded-lg mb-6"></div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full sm:w-48 h-10 bg-base-200 rounded-lg"></div>
          <div className="w-full sm:w-64 h-10 bg-base-200 rounded-lg"></div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="p-4">
            <div className="grid grid-cols-7 gap-4">
              {[...Array(7)].map((_, index) => (
                <div key={index} className="h-6 bg-base-200 rounded-md"></div>
              ))}
            </div>
            
            {[...Array(5)].map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-4 p-4 border-t border-base-200">
                {[...Array(7)].map((_, colIndex) => (
                  <div key={colIndex} className="h-8 bg-base-200 rounded-md"></div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <div className="h-10 w-48 bg-base-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Order);