"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Heading, Input, Table } from "@medusajs/ui";
import withAuth from "@/lib/withAuth";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { useGetOrders } from "@/app/hooks/orders/useGetOrders";
import { getColors } from "@/app/utils/dummyData";
import { useRouter } from "next/navigation";
import Pagination from "@/app/utils/pagination";
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

const Customer = () => {
  const { data: customers, error, isLoading } = useGetCustomers();
  const { data: orders } = useGetOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const pageSize = 6;

  const getOrderCountForCustomer = (customerId) => {
    if (!orders) return 0;
    return orders.filter((order) => order.customer_id === customerId).length;
  };

  const formatDate = (timestamp) => {
    const date = parseISO(timestamp);
    return format(date, "dd MMM yyyy");
  };

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];

    const searchLower = searchQuery.toLowerCase();

    return customers.filter((customer) => {
      return (
        customer.first_name.toLowerCase().includes(searchLower) ||
        customer.last_name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.created_at.toLowerCase().includes(searchLower)
      );
    });
  }, [customers, searchQuery]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [filteredCustomers, currentPage, pageSize]);

  const getRowIndex = (index: number) => {
    return (currentPage * pageSize) + index + 1;
  };

  if (isLoading) {
    return <CustomerSkeleton />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-6"
      >
        <Heading className="text-2xl font-bold text-indigo-900 mb-4 sm:mb-0">
          Customers
        </Heading>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.2, duration: 0.3 }}
          className="w-full sm:w-72 relative"
        >
          <Input
            size="base"
            type="search"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border-indigo-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.3, duration: 0.5 }}
        className="overflow-x-auto bg-white rounded-xl shadow-md"
      >
        <Table className="bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100  ">
          <Table.Header>
            <Table.Row className="">
              <Table.HeaderCell className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                Customer
              </Table.HeaderCell>
              <Table.HeaderCell className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                Date added
              </Table.HeaderCell>
              <Table.HeaderCell className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                Name
              </Table.HeaderCell>
              <Table.HeaderCell className="px-4 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                Email
              </Table.HeaderCell>
              <Table.HeaderCell className="px-2 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                Orders
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <AnimatePresence>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => router.push(`/vendor/customers/${customer.id}`)}
                    className="cursor-pointer transition-colors hover:bg-indigo-50"
                  >
                    <Table.Cell className="px-4 py-2 whitespace-nowrap text-sm font-bold text-indigo-900">
                      #{getRowIndex(index)}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-2 whitespace-nowrap text-sm text-indigo-600">
                      {formatDate(customer.created_at)}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getColors(index)}`}
                        >
                          {customer.first_name.charAt(0).toUpperCase()}
                        </motion.div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-indigo-900">
                            {customer.first_name} {customer.last_name}
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-2 whitespace-nowrap text-sm text-indigo-600">
                      {customer.email}
                    </Table.Cell>
                    <Table.Cell className="px-6 py-2 whitespace-nowrap text-sm font-medium text-indigo-900">
                      {getOrderCountForCustomer(customer.id)}
                    </Table.Cell>
                  </motion.tr>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell className="px-4 py-10 text-center text-indigo-600">
                    No customers found
                  </Table.Cell>
                </Table.Row>
              )}
            </AnimatePresence>
          </Table.Body>
        </Table>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6"
      >
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredCustomers.length}
          data={filteredCustomers}
        />
      </motion.div>
    </motion.div>
  );
};

const CustomerSkeleton = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg border border-indigo-100/50 p-6 animate-pulse"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="h-8 bg-indigo-200 rounded w-40 mb-4 sm:mb-0"></div>
        <div className="w-full sm:w-72 h-10 bg-indigo-200 rounded-full"></div>
      </div>

      <div className="bg-white rounded-xl shadow-inner overflow-hidden">
        <div className="border-b border-indigo-200">
          <div className="flex px-6 py-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex-1 h-4 bg-indigo-100 rounded mr-2"></div>
            ))}
          </div>
        </div>
        <div className="divide-y divide-indigo-100">
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex px-6 py-4">
              {[...Array(5)].map((_, cellIndex) => (
                <div key={cellIndex} className="flex-1 h-4 bg-indigo-50 rounded mr-2"></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="h-8 bg-indigo-200 rounded w-64"></div>
      </div>
    </motion.div>
  );
};

export default withAuth(Customer);