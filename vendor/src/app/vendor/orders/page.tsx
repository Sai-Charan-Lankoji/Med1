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
import React, { useCallback, useMemo, useState } from "react";
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
  const { data: OrdersData, isLoading } = useGetOrders();
  const { data: saleschannelsData } = useGetSalesChannels();
  const { data: customersData } = useGetCustomers();
  const { data: stores } = useGetStores();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStore, setSelectedStore] = useState("all");
  const router = useRouter();
  const pageSize = 6;
   const getCustomerFirstName = useCallback((customerId: any) => {
    const customer = customersData?.find(
      (customer: { id: any }) => customer.id === customerId
    );
    return customer ? `${customer.first_name} ${customer.last_name}` : "N/A";
  }, [customersData]);

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
  const handlefetchOrders = () => {
    window.location.reload();
  }
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
        <Heading level="h2" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Orders
        </Heading>
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
            <Select
              value={selectedStore}
              onValueChange={(value) => setSelectedStore(value)}
            >
              <Select.Trigger className="bg-white border px-6 border-indigo-200 rounded-xl">
                <Select.Value placeholder="Select a store" />
              </Select.Trigger>
              <Select.Content className="bg-white rounded-xl border-2 border-indigo-200 shadow-lg">
                <Select.Item value="all" className="hover:bg-indigo-50">All Stores</Select.Item>
                {stores?.map((store: any) => (
                  <Select.Item key={store.id} value={store.id} className="hover:bg-indigo-50">
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
            <div className="relative w-full rounded-lg sm:w-auto">
              <Input
                type="text"
                placeholder="Search Orders"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 text-sm pl-11 py-4 border bg-white/50 border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
            className="text-center text-indigo-500 py-8 bg-white rounded-lg shadow"
          >
            <p>No Orders found.</p>
            <Button
              onClick={handlefetchOrders}
              className="mt-2 space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-600 transition duration-300"
            >
              <span>Retry</span>
              <TbReload className="w-5 h-5" />
            </Button>          </motion.div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md">
            <Table className="w-full">
              <Table.Header className="">
                <Table.Row>
                  <Table.HeaderCell className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Order
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Date Added
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-6 py-3 text-left text-xs font-semibold text-indigo-800">
                    Customer
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Fulfillment
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Payment Status
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Store
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-4 py-3 text-center text-xs font-semibold text-indigo-800">
                    Total
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
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
                      <Table.Cell className="px-4 py-3 flex flex-row justify-center text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        <Tooltip
                          content="View Order"
                          className="bg-gradient-to-r from-blue-400 to-purple-300 text-white text-xs font-mono rounded-xl py-2 px-2"
                        >
                          <Button
                            variant="transparent"
                            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
                            onClick={() => {
                              router.push(`/vendor/orders/${order.id}`);
                            }}
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                        </Tooltip>
                        <span className="ml-2">{getRowIndex(index)}</span>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        <Tooltip
                          content={formatTimestamp(order.createdAt)}
                          className="bg-gradient-to-r from-blue-400 to-purple-300 text-white text-xs rounded-xl py-2 px-2"
                        >
                          <span className="cursor-help">
                            {formatDate(order.createdAt)}
                          </span>
                        </Tooltip>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center space-x-2">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${getColors(index)}`}
                        >
                          {getCustomerFirstName(order.customer_id).charAt(0).toUpperCase()}
                        </motion.div>
                        <span>{getCustomerFirstName(order.customer_id)}</span>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        <Badge className="bg-indigo-100 text-indigo-800 rounded-full px-2 py-1">
                          {order.fulfillment_status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        <Badge
                          color={order.payment_status === "captured" ? "green" : "orange"}       
                          className="rounded-full px-2 py-1"
                        >
                          {order.payment_status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        {getStoreName(order.store_id)}
                      </Table.Cell>
                      <Table.Cell className="px-4 py-3 text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
                        <span className="font-medium">{order.total_amount}</span>{" "}
                        <span className="text-xs text-indigo-500">{order.currency_code.toUpperCase()}</span>
                      </Table.Cell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </Table.Body>
            </Table>
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
            <div key={rowIndex} className="grid grid-cols-7 gap-4 p-4 border-t border-indigo-100">
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

export default withAuth(Order);