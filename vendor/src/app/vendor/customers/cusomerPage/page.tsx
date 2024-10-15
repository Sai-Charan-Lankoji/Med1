"use client";
import { FiSearch } from "react-icons/fi";
import { getColors } from "../../../utils/dummyData";
import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { DropdownMenu, IconButton, Input, Table } from "@medusajs/ui";
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import withAuth from "@/lib/withAuth";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { useGetOrders } from "@/app/hooks/orders/useGetOrders";

const Customer = () => {
  const { data: customers, error, isLoading } = useGetCustomers();
  const { data: orders } = useGetOrders();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  
  const pageSize = 6;

  // Get order count for a customer
  const getOrderCountForCustomer = (customerId: string) => {
    if (!orders) return 0;
    return orders.filter((order: { customer_id: string; }) => order.customer_id === customerId).length;
  };

  // Filter customers based on search query and orders relationship
  const filteredCustomers = useMemo(() => {
    if (!customers || !orders) return [];

    return customers.filter((customer: { vendor_id: any; email: string; first_name: string; last_name: string; }) => {
      // First check if customer has any orders
      const hasOrders = orders.some((order: { vendor_id: any; }) => order.vendor_id === customer.vendor_id);
      
      // Then apply search filters
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.first_name?.toLowerCase().includes(searchLower) ||
        customer.last_name?.toLowerCase().includes(searchLower);

      // Return true if customer has orders and matches search criteria
      return hasOrders && matchesSearch;
    });
  }, [customers, orders, searchQuery]);

  // Get current page of customers
  const currentCustomers = useMemo(() => {
    const offset = currentPage * pageSize;
    const limit = Math.min(offset + pageSize, filteredCustomers.length);
    return filteredCustomers.slice(offset, limit);
  }, [currentPage, pageSize, filteredCustomers]);

  const formatDate = (timestamp: string) => {
    const date = parseISO(timestamp);
    return format(date, "dd MMM yyyy");
  };

  return (
    <div className="bg-white">
      <div className="flex flex-row justify-end items-end space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 mt-4 sm:mt-0 ">
        <div className="relative">
          <Input
            size="small"
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <hr className="mt-4" />
      <Table className="min-w-full bg-transparent border-collapse">
        <Table.Header className="border-b border-gray-300">
          <Table.Row>
            <Table.HeaderCell className="px-2 py-2 text-center text-xs font-medium text-gray-700">
              Date added
            </Table.HeaderCell>
            <Table.HeaderCell className="px-4 py-2 text-center text-xs font-medium text-gray-700">
              Name
            </Table.HeaderCell>
            <Table.HeaderCell className="px-2 py-2 text-center text-xs font-medium text-gray-700">
              Email
            </Table.HeaderCell>
            <Table.HeaderCell className="px-2 py-2 text-center text-xs font-medium text-gray-700">
              Orders
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredCustomers.map((customer: any, index: any) => (
            <Table.Row
              key={customer.id}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <Table.Cell className="px-4 py-3 text-[13px] text-gray-700 border-b text-center border-gray-300">
                {formatDate(customer.created_at)}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 text-[13px] text-gray-700 border-b text-center border-gray-300">
                <div className="flex justify-center items-center space-x-2">
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-white ${getColors(
                      index
                    )}`}
                  >
                    {customer.email.charAt(0)}
                  </div>
                  <span className="text-gray-700">{customer.first_name}</span>
                </div>
              </Table.Cell>
              <Table.Cell className="px-4 py-3 text-[13px] text-gray-700 border-b text-center border-gray-300">
                {customer.email}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 text-[13px] text-gray-700 border-b border-gray-300 text-center">
                {getOrderCountForCustomer(customer.id)}
              </Table.Cell>
              <Table.Cell className="px-4 py-3 text-[13px] text-gray-700 border-b border-gray-300 text-center">
                <DropdownMenu>
                  <DropdownMenu.Trigger asChild>
                    <IconButton
                      variant="transparent"
                      className="rounded-full w-8 h-8 flex justify-center items-center hover:bg-gray-300 active:bg-gray-200"
                    >
                      <EllipsisHorizontal className="w-6 h-6 text-gray-500" />
                    </IconButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="bg-white">
                    <DropdownMenu.Label>Actions</DropdownMenu.Label>
                    <DropdownMenu.Item className="bg-white text-gray-500 hover:text-white">
                      <PencilSquare className="mr-2" />
                      Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="bg-white text-gray-500 hover:text-white">
                      <Trash className="mr-2" />
                      Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default withAuth(Customer);