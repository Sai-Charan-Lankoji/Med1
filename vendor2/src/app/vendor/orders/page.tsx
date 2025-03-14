"use client";

import React, { useCallback, useMemo, useState } from "react";
import withAuth from "@/lib/withAuth";
import { useGetOrders } from "@/app/hooks/orders/useGetOrders";
import { useGetSalesChannels } from "@/app/hooks/saleschannel/useGetSalesChannels";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { useRouter } from "next/navigation";
import Pagination from "@/app/utils/pagination";
import { Search, Eye, RefreshCw } from "lucide-react";
import { parseISO, format, parse, isValid } from "date-fns";
import { useGetStores } from "@/app/hooks/store/useGetStores";
import { motion, AnimatePresence } from "framer-motion";

const Order = () => {
  const { data: OrdersData, isLoading: ordersLoading, refetch: refetchOrders } = useGetOrders();
  const { data: saleschannelsData } = useGetSalesChannels();
  const { data: customersData, isLoading: customersLoading } = useGetCustomers();
  const { data: stores, isLoading: storesLoading } = useGetStores();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStore, setSelectedStore] = useState("all");
  const router = useRouter();
  const pageSize = 6;

  const getCustomerFirstName = useCallback(
    (customerId: any) => {
      const customer = customersData?.find(
        (customer: { id: any }) => customer.id === customerId
      );
      return customer ? `${customer.first_name} ${customer.last_name}` : "N/A";
    },
    [customersData]
  );

  const formatTimestamp = (timestamp: string) => {
    const date = parseISO(timestamp);
    return format(date, "dd MMM yyyy hh:mm a").toLocaleString();
  };

  const formatDate = (timestamp: string) => {
    const date = parseISO(timestamp);
    return format(date, "dd-MM-yyyy");
  };

  const parseDateString = (dateString: string) => {
    const formats = ["dd-MM-yyyy", "yyyy-MM-dd", "MM-dd-yyyy"];
    for (const formatString of formats) {
      const parsedDate = parse(dateString, formatString, new Date());
      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }
    return null;
  };

  const filteredOrders = useMemo(() => {
    if (!OrdersData || !customersData || !stores) return [];

    const searchLower = searchQuery.toLowerCase();
    const searchDate = parseDateString(searchQuery);

    return OrdersData.filter((order) => {
      const orderDate = parseISO(order.createdAt);
      const matchesSearch =
        getCustomerFirstName(order.customer_id)
          .toLowerCase()
          .includes(searchLower) ||
        order.payment_status.toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower) ||
        (searchDate &&
          format(orderDate, "dd-MM-yyyy") === format(searchDate, "dd-MM-yyyy"));

      const matchesStore =
        selectedStore === "all" || order.store_id === selectedStore;

      return matchesSearch && matchesStore;
    });
  }, [OrdersData, customersData, stores, searchQuery, selectedStore, getCustomerFirstName]);

  const paginatedOrders = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, pageSize]);

  const getRowIndex = (index: number) => {
    return currentPage * pageSize + index + 1;
  };

  const getStoreName = (storeId: string) => {
    const store = stores?.find((s: any) => s.id === storeId);
    return store ? store.name : "N/A";
  };

  const handlefetchOrders = () => {
    refetchOrders();
  };

  if (ordersLoading || customersLoading || storesLoading) {
    return <OrderSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 container mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-primary">Orders</h2>
        <p className="text-base-content/70 text-sm">Manage and track your orders efficiently</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-8 bg-base-100 p-4 rounded-xl shadow-lg"
      >
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          className="select select-primary w-full sm:w-48"
        >
          <option value="all">All Stores</option>
          {stores?.map((store: any) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        <div className="w-full sm:w-64">
          <label className="input-group">
            <input
              type="text"
              placeholder="Search Orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full"
            />
            <button className="btn btn-square btn-primary">
              <Search className="w-4 h-4" />
            </button>
          </label>
        </div>
      </motion.div>

      {/* Orders Table or No Data */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col gap-6"
      >
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12 bg-base-100 rounded-xl shadow-lg"
          >
            <p className="text-lg text-base-content/70 mb-4">No Orders Found</p>
            <button
              onClick={handlefetchOrders}
              className="btn btn-primary btn-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </button>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full bg-base-100 rounded-xl shadow-lg">
              <thead>
                <tr className="bg-base-200 text-base-content/80">
                  <th className="text-center">Order</th>
                  <th className="text-center">Date Added</th>
                  <th className="text-left">Customer</th>
                  <th className="text-center">Fulfillment</th>
                  <th className="text-center">Payment</th>
                  <th className="text-center">Store</th>
                  <th className="text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedOrders.map((order: any, index: any) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="btn btn-ghost btn-xs text-primary hover:bg-primary/10"
                            onClick={() => router.push(`/vendor/orders/${order.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {getRowIndex(index)}
                        </div>
                      </td>
                      <td className="text-center">{formatDate(order.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar">
                            <div className="w-8 rounded-full bg-accent text-white flex text-center justify-center">
                              {getCustomerFirstName(order.customer_id).charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <span>{getCustomerFirstName(order.customer_id)}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge badge-outline badge-secondary">
                          {order.fulfillment_status}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            order.payment_status === "captured" ? "badge-success" : "badge-warning"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="text-center">{getStoreName(order.store_id)}</td>
                      <td className="text-center">
                        <span className="font-medium">{order.total_amount}</span>{" "}
                        <span className="text-xs text-base-content/70">
                          {order.currency_code.toUpperCase()}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={filteredOrders.length}
            data={filteredOrders}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const OrderSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 container mx-auto"
    >
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-base-200 rounded-lg mb-8"></div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="h-10 w-48 bg-base-200 rounded-lg"></div>
          <div className="h-10 w-64 bg-base-200 rounded-lg"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full bg-base-100 rounded-xl shadow-lg">
            <thead>
              <tr className="bg-base-200">
                <th className="text-center"><div className="h-6 w-12 bg-base-300 rounded"></div></th>
                <th className="text-center"><div className="h-6 w-20 bg-base-300 rounded"></div></th>
                <th className="text-left"><div className="h-6 w-24 bg-base-300 rounded"></div></th>
                <th className="text-center"><div className="h-6 w-20 bg-base-300 rounded"></div></th>
                <th className="text-center"><div className="h-6 w-20 bg-base-300 rounded"></div></th>
                <th className="text-center"><div className="h-6 w-16 bg-base-300 rounded"></div></th>
                <th className="text-center"><div className="h-6 w-16 bg-base-300 rounded"></div></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="text-center"><div className="h-8 w-12 bg-base-200 rounded"></div></td>
                  <td className="text-center"><div className="h-8 w-20 bg-base-200 rounded"></div></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-base-200 rounded-full"></div>
                      <div className="h-8 w-24 bg-base-200 rounded"></div>
                    </div>
                  </td>
                  <td className="text-center"><div className="h-8 w-20 bg-base-200 rounded"></div></td>
                  <td className="text-center"><div className="h-8 w-20 bg-base-200 rounded"></div></td>
                  <td className="text-center"><div className="h-8 w-16 bg-base-200 rounded"></div></td>
                  <td className="text-center"><div className="h-8 w-16 bg-base-200 rounded"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default withAuth(Order);