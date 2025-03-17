"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { useGetOrders } from "@/app/hooks/orders/useGetOrders";
import { getColors } from "@/app/utils/dummyData";
import { useRouter } from "next/navigation";
import Pagination from "@/app/utils/pagination";
import { Search } from "lucide-react";
import withAuth from "@/lib/withAuth";

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
    return currentPage * pageSize + index + 1;
  };

  if (isLoading) {
    return <CustomerSkeleton />;
  }

  return (
    <div className="p-6 transition-all duration-300 ease-in-out">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 transition-all duration-300">
        <h1 className="text-2xl font-bold text-primary mb-4 sm:mb-0">
          Customers
        </h1>
        <div className="w-full sm:w-72 relative transition-all duration-300">
          <div className="relative">
            <input
              type="search"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10 pr-4 py-2 rounded-full border-primary-content focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content opacity-50" />
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl transition-all duration-300">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Date added
                  </th>
                  <th className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-xs font-semibold text-primary uppercase tracking-wider">
                    Orders
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      onClick={() => router.push(`/vendor/customers/${customer.id}`)}
                      className="hover:bg-base-200 cursor-pointer transition-all duration-200"
                    >
                      <td className="font-bold text-primary">
                        #{getRowIndex(index)}
                      </td>
                      <td className="text-secondary">
                        {formatDate(customer.created_at)}
                      </td>
                      <td>
                        <div className="flex items-center">
                          <div className={`avatar avatar-placeholder`}>
                            <div className="bg-primary text-primary-content rounded-full w-8">
                              <span>{customer.first_name.charAt(0).toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-base-content">
                              {customer.first_name} {customer.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-secondary">
                        {customer.email}
                      </td>
                      <td className="font-medium text-primary">
                        {getOrderCountForCustomer(customer.id)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-secondary py-10"
                    >
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 transition-all duration-300">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalItems={filteredCustomers.length}
          data={filteredCustomers}
        />
      </div>
    </div>
  );
};

const CustomerSkeleton = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="skeleton h-8 w-40 mb-4 sm:mb-0"></div>
        <div className="skeleton w-full sm:w-72 h-10 rounded-full"></div>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  {[...Array(5)].map((_, index) => (
                    <th key={index}>
                      <div className="skeleton h-4 w-full"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(5)].map((_, cellIndex) => (
                      <td key={cellIndex}>
                        <div className="skeleton h-4 w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="skeleton h-8 w-64"></div>
      </div>
    </div>
  );
};

export default withAuth(Customer);