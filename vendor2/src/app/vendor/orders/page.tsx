"use client";

import React, { useCallback, useMemo, useState } from "react";
import withAuth from "@/lib/withAuth";
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
import { Eye } from "lucide-react";

const Order = () => {
  const { data: OrdersData, isLoading } = useGetOrders();
  const { data: saleschannelsData } = useGetSalesChannels();
  const { data: customersData } = useGetCustomers();
  const { data: stores } = useGetStores();
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
    if (!OrdersData) return [];

    const searchLower = searchQuery.toLowerCase();
    const searchDate = parseDateString(searchQuery);

    return OrdersData?.filter((order) => {
      const orderDate = parseISO(order.createdAt);
      const matchesSearch =
        getCustomerFirstName(order.customer_id).toLowerCase().includes(searchLower) ||
        order.payment_status.toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower) ||
        (searchDate && format(orderDate, "dd-MM-yyyy") === format(searchDate, "dd-MM-yyyy"));

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
    return currentPage * pageSize + index + 1;
  };

  const getStoreName = (storeId: string) => {
    const store = stores?.find((s: any) => s.id === storeId);
    return store ? store.name : "N/A";
  };

  const handlefetchOrders = () => {
    window.location.reload();
  };

  if (isLoading) {
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
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Orders
        </h2>
      </motion.div>
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
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="select select-bordered bg-white border-indigo-200 rounded-xl w-full sm:w-48"
            >
              <option value="all">All Stores</option>
              {stores?.map((store: any) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex flex-row items-center space-x-4 w-full sm:w-auto"
          >
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search Orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full text-sm pl-11 py-4 bg-white/50 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
            </div>
          </motion.div>
        </div>
      </motion.div>
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
            className="text-center text-indigo-500 py-8 bg-white rounded-lg shadow-sm"
          >
            <p>No Orders found.</p>
            <button
              onClick={handlefetchOrders}
              className="btn btn-primary mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 hover:from-blue-600 hover:to-purple-600 transition duration-300 flex items-center gap-2"
            >
              <span>Retry</span>
              <TbReload className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Order
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-800">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Fulfillment
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Payment Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Store
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Total
                  </th>
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
                      className="hover:bg-indigo-50 transition-colors duration-150 ease-in-out"
                    >
                      <td className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="btn btn-ghost btn-sm text-indigo-600 hover:text-indigo-800 tooltip"
                            data-tip="View Order"
                            onClick={() => router.push(`/vendor/orders/${order.id}`)}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <span>{getRowIndex(index)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center tooltip" data-tip={formatTimestamp(order.createdAt)}>
                        <span className="cursor-help">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center space-x-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${getColors(index)}`}
                        >
                          {getCustomerFirstName(order.customer_id).charAt(0).toUpperCase()}
                        </motion.div>
                        <span>{getCustomerFirstName(order.customer_id)}</span>
                      </td>
                      <td className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        <span className="badge badge-outline bg-indigo-100 text-indigo-800">
                          {order.fulfillment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        <span
                          className={`badge ${
                            order.payment_status === "captured"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        {getStoreName(order.store_id)}
                      </td>
                      <td className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        <span className="font-medium">{order.total_amount}</span>{" "}
                        <span className="text-xs text-indigo-500">
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
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg"
    >
      <div className="animate-pulse">
        <div className="bg-indigo-200 h-8 w-32 rounded-lg mb-6"></div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="bg-indigo-200 h-10 w-48 rounded-lg"></div>
          <div className="bg-indigo-200 h-10 w-64 rounded-lg"></div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-7 gap-4 p-4 bg-indigo-50">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="bg-indigo-200 h-6 rounded-md"></div>
            ))}
          </div>
          {[...Array(6)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-7 gap-4 p-4 border-t border-indigo-100"
            >
              {[...Array(7)].map((_, colIndex) => (
                <div key={colIndex} className="bg-indigo-100 h-8 rounded-md"></div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <div className="bg-indigo-200 h-10 w-48 rounded-lg"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Order;