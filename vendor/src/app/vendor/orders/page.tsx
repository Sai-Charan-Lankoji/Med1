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
import React, { useMemo, useState } from "react";
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
import { useGetStore } from "@/app/hooks/store/useGetStore";

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

  const getCustomerFirstName = (customerId: any) => {
    const customer = customersData?.find(
      (customer: { id: any }) => customer.id === customerId
    );
    return customer ? `${customer.first_name} ${customer.last_name}` : "N/A";
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

  const filteredOrders = useMemo(() => {
    if (!OrdersData) return [];

    const searchLower = searchQuery.toLowerCase();
    const searchDate = parseDateString(searchQuery);

    return OrdersData.filter((order) => {
      const orderDate = parseISO(order.created_at);
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

  if (isLoading) {
    return <OrderSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <Heading level="h2" className="font-semibold text-2xl mb-4">
        Orders
      </Heading>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between flex-wrap space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 mt-4 sm:mt-0 w-full">
          <div className="flex flex-row items-center space-x-2">
            <Select
              value={selectedStore}
              onValueChange={(value) => setSelectedStore(value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select a store" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="all">All Stores</Select.Item>
                {stores?.map((store: any) => (
                  <Select.Item key={store.id} value={store.id}>
                    {store.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>

          <div className="flex flex-row items-center space-x-4">
            <div className="relative w-full rounded-md sm:w-auto">
              <Input
                type="text"
                placeholder="Search or enter date (DD-MM-YYYY)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-[13px] pl-11 py-1 border bg-transparent border-gray-300 rounded-md shadow-sm sm:w-auto focus:border-blue-500 outline-none"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No Orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full p-2">
              <Table.Header className="border-ui-border-base">
                <Table.Row>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Order
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Date Added
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-6 py-2  text-xs md:text-sm font-medium text-gray-700">
                    Customer
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Fulfillment
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Payment Status
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Store
                  </Table.HeaderCell>
                  <Table.HeaderCell className="px-2 py-2 text-center text-xs md:text-sm font-medium text-gray-700">
                    Total
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paginatedOrders.map((order: any, index: any) => (
                  <Table.Row
                    key={order.id}
                    className="hover:bg-gray-50 text-[rgb(17, 24, 39)]"
                  >
                    <Table.Cell className="px-4 py-3 flex flex-row justify-between text-[12px] md:text-[14px] text-gray-700 text-center hover:text-violet-500">
                      <Tooltip
                        className="font-semibold text-[rgb(107, 114, 128)] text-[12px] md:text-[14px]"
                        content="View Order"
                      >
                        <Button
                          variant="transparent"
                          className="text-[12px] md:text-[14px] text-[rgb(17, 24, 39)] hover:bg-none"
                          onClick={() => {
                            router.push(`/vendor/orders/${order.id}`);
                          }}
                        >
                          <Eye />
                        </Button>
                      </Tooltip>
                      {getRowIndex(index)}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center">
                      <Tooltip
                        className="font-semibold text-[rgb(107, 114, 128)] text-[12px] md:text-[14px]"
                        content={formatTimestamp(order.created_at)}
                      >
                        <Button
                          variant="transparent"
                          className="text-[12px] md:text-[14px] text-[rgb(17, 24, 39)] hover:bg-none"
                        >
                          {formatDate(order.created_at)}
                        </Button>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center flex flex-row space-x-2">
                      <div>
                        <div
                          className={`w-6 h-6 flex items-left justify-center rounded-full text-white ${getColors(
                            index
                          )}`}
                        >
                          {order.email.charAt(0)}
                        </div>
                      </div>
                      <span className="text-gray-700 text-center">
                        {getCustomerFirstName(order.customer_id)}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center">
                      {order.fulfillment_status}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center flex items-center justify-center space-x-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full inline-block ${
                          order.payment_status === "captured"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      <span>{order.payment_status}</span>
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center">
                      {getStoreName(order.store_id)}
                    </Table.Cell>
                    <Table.Cell className="px-4 py-3 text-[12px] md:text-[14px] text-gray-700 text-center flex flex-row justify-center space-x-2">
                      <span className="text-[14px] font-medium text-slate-600">
                        {order.total_amount}
                      </span>{" "}
                      <span className="text-[12px] font-medium text-gray-400">
                        {order.currency_code.toUpperCase()}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredOrders.length}
          data={filteredOrders}
        />
      </div>
    </div>
  );
};

const OrderSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="animate-pulse">
        <div className="flex flex-row justify-between items-center mb-6">
          <div className="bg-gray-200 h-8 w-24 rounded"></div>
          <div className="bg-gray-200 h-8 w-32 rounded"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full p-2">
            <thead>
              <tr>
                <th className="px-2 py-2 text-xs font-medium text-gray-700">
                  <div className="bg-gray-200 h-4 w-16 rounded"></div>
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-700">
                  <div className="bg-gray-200 h-4 w-16 rounded"></div>
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-700">
                  <div className="bg-gray-200 h-4 w-16 rounded"></div>
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-700">
                  <div className="bg-gray-200 h-4 w-16 rounded"></div>
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-700">
                  <div className="bg-gray-200 h-4 w-16 rounded"></div>
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-700">
                  <div className="bg-gray-200 h-4 w-16 rounded"></div>
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-700">
                  <div className="bg-gray-200 h-4 w-16 rounded"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50 text-gray-700">
                  <td className="px-4 py-3 text-center">
                    <div className="bg-gray-200 h-6 w-10 rounded"></div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="bg-gray-200 h-6 w-24 rounded"></div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="bg-gray-200 h-6 w-16 rounded"></div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="bg-gray-200 h-6 w-20 rounded"></div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="bg-gray-200 h-6 w-16 rounded"></div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="bg-gray-200 h-6 w-24 rounded"></div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="bg-gray-200 h-6 w-16 rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-4">
          <div className="bg-gray-200 h-8 w-32 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Order);