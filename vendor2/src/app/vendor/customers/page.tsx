"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { useGetOrders } from "@/app/hooks/orders/useGetOrders";
import { useRouter } from "next/navigation";
import Pagination from "@/app/utils/pagination";
import { Search, Users } from "lucide-react";
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
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary mb-4 sm:mb-0 flex items-center gap-2">
          <Users className="h-6 w-6" /> Customers
        </h1>
        <div className="w-full sm:w-72 relative">
          <div className="join w-full">
            <input
              type="search"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input join-item w-full pl-10"
            />
            <button className="btn btn-primary join-item">
              <Search className="h-5 w-5" />
            </button>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="h-4 w-4 text-base-content opacity-50" />
            </div>
          </div>
        </div>
      </div>

      <div className="card card-border bg-base-100  ">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-200/50 text-base-content">
                  <th className="text-xs font-semibold uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-xs font-semibold uppercase tracking-wider">
                    Date added
                  </th>
                  <th className="text-xs font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-xs font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-xs font-semibold uppercase tracking-wider">
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
                      className="hover:bg-base-200/30 cursor-pointer"
                    >
                      <td className="font-bold">
                        #{getRowIndex(index)}
                      </td>
                      <td>
                        {formatDate(customer.created_at)}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar avatar-placeholder">
                            <div className="w-8 rounded-full bg-primary text-primary-content">
                              <span>{customer.first_name.charAt(0).toUpperCase()}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">
                              {customer.first_name} {customer.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-base-content/70">
                        {customer.email}
                      </td>
                      <td>
                        <div className="badge badge-primary badge-soft">
                          {getOrderCountForCustomer(customer.id)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-base-content/70 py-10"
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

      <div className=" border-t border-base-200">
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
        <div className="skeleton w-full sm:w-72 h-10"></div>
      </div>

      <div className="card card-border bg-base-100 shadow-2xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/40">
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