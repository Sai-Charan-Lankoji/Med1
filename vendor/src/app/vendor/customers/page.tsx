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

  // Memoize the filtered customers
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

  // Calculate the paginated customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCustomers.slice(startIndex, endIndex);
  }, [filteredCustomers, currentPage, pageSize]);

  const getRowIndex = (index: number) => {
    return (currentPage * pageSize) + index + 1;
  };
  if (isLoading) {
    return (
      <div>
        <CustomerSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-ui-border-base p-2">
      <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-ui-border-base">
        <Heading className="text-ui-fg-base text-xl leading-6 font-medium mb-4 sm:mb-0">
          Customers
        </Heading>
        <div className="w-full sm:w-72">
          <Input
            size="base"
            type="search"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.Header>
            <Table.Row className="border-t-0">
              <Table.HeaderCell className="w-1/4 px-4 py-4 text-xs font-semibold text-ui-fg-subtle">
                Customer
              </Table.HeaderCell>
              <Table.HeaderCell className="w-1/4 px-6 py-4 text-xs font-semibold text-ui-fg-subtle">
                Date added
              </Table.HeaderCell>
              <Table.HeaderCell className="w-1/4 px-6 py-4 text-xs font-semibold text-ui-fg-subtle">
                Name
              </Table.HeaderCell>
              <Table.HeaderCell className="w-1/4 px-6 py-4 text-xs font-semibold text-ui-fg-subtle">
                Email
              </Table.HeaderCell>
              <Table.HeaderCell className="w-1/4 px-6 py-4 text-xs font-semibold text-ui-fg-subtle">
                Orders
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {paginatedCustomers.length > 0 ? (
              paginatedCustomers.map((customer, index) => (
                <Table.Row
                  key={customer.id}
                  onClick={() =>
                    router.push(`/vendor/customers/${customer.id}`)
                  }
                  className="cursor-pointer transition-colors hover:bg-ui-bg-base-hover"
                >
                  <Table.Cell className="w-1/4 px-4 py-4 text-sm text-ui-fg-subtle">
                    {getRowIndex(index)}
                  </Table.Cell>
                  <Table.Cell className="w-1/4 px-6 py-4 text-sm text-ui-fg-subtle">
                    {formatDate(customer.created_at)}
                  </Table.Cell>

                  <Table.Cell className="w-1/4 px-0 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-medium ${getColors(
                          index
                        )}`}
                      >
                        {customer.first_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-ui-fg-base whitespace-nowrap">
                        {customer.first_name} {customer.last_name}
                      </span>
                    </div>
                  </Table.Cell>

                  <Table.Cell className="w-1/4 px-0 py-4">
                    <span className="text-sm text-ui-fg-subtle">
                      {customer.email}
                    </span>
                  </Table.Cell>

                  <Table.Cell className="w-1/4 px-10 py-4">
                    <span className="text-sm font-medium text-ui-fg-base">
                      {getOrderCountForCustomer(customer.id)}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row className="flex flex-row justify-center text-center">
                <Table.Cell className="py-10 text-center"></Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={filteredCustomers.length}
        data={filteredCustomers}
      />
    </div>
  );
};

const CustomerSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-ui-border-base">
      <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-ui-border-base animate-pulse">
        <div className="bg-gray-200 h-8 w-24 rounded mb-4 sm:mb-0"></div>
        <div className="w-full sm:w-72">
          <div className="bg-gray-200 h-10 rounded w-full"></div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              {[...Array()].map((_, index) => (
                <th
                  key={index}
                  className="w-1/4 px-6 py-4 text-xs font-semibold text-ui-fg-subtle"
                >
                  <div className="bg-gray-200 h-4 w-24 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t border-gray-100">
                <td className="w-1/4 px-6 py-4">
                  <div className="bg-gray-200 h-6 w-24 rounded"></div>
                </td>
                <td className="w-1/4 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-300 w-8 h-8 rounded-full"></div>
                    <div className="bg-gray-200 h-6 w-32 rounded"></div>
                  </div>
                </td>
                <td className="w-1/4 px-6 py-4">
                  <div className="bg-gray-200 h-6 w-40 rounded"></div>
                </td>
                <td className="w-1/4 px-6 py-4">
                  <div className="bg-gray-200 h-6 w-12 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(Customer);
