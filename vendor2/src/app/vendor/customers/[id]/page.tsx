// CustomerDetails.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Pagination from "@/app/utils/pagination";
import { BackButton } from "@/app/utils/backButton";
import { useGetCustomer } from "@/app/hooks/customer/useGetCustomer";
import { useGetOrders } from "@/app/hooks/orders/useGetOrders";

const CustomerDetails = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();
  const params = useParams();
  const customerId = params?.id as string | undefined;
  const { data: customer } = useGetCustomer(customerId);
  const { data: orders } = useGetOrders();
  
  // Filter orders for this customer
  const customerOrders = useMemo(() => {
    return orders?.filter((order) => order.customer_id === customer?.id) || [];
  }, [orders, customer]);

  // Consistent page size - matching Pagination component
  const pageSize = 8;

  // Calculate current page orders
  const currentOrders = useMemo(() => {
    const offset = currentPage * pageSize;
    return customerOrders.slice(offset, offset + pageSize);
  }, [currentPage, customerOrders, pageSize]);

  return (
    <div className="min-h-screen overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackButton
          name="Customers"
          className="btn btn-ghost btn-sm text-primary hover:text-primary-focus transition-colors"
        />

        {!customer ? (
          <CustomerDetailsSkeleton />
        ) : (
          <>
            {/* Customer Profile Card - unchanged */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-8">
                <div className="flex items-center space-x-6">
                  <div className="avatar avatar-placeholder">
                    <div className="bg-primary text-primary-content text-3xl w-20 h-20 rounded-lg">
                      <span>{customer.first_name?.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-base-content">
                      {customer.first_name} {customer.last_name}
                    </h2>
                    <p className="text-secondary mt-1">{customer.email}</p>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="stats stats-vertical lg:stats-horizontal shadow">
                  <div className="stat">
                    <div className="stat-title">First seen</div>
                    <div className="stat-value text-lg">
                      {new Date(customer.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  {/* ... other stats unchanged ... */}
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body p-6 border-b border-base-300">
                <h2 className="card-title text-xl">Orders History</h2>
                <p className="text-sm text-base-content opacity-70">
                  Overview of customer purchase history
                </p>
              </div>

              {customerOrders.length ? (
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th className="bg-base-200">Order</th>
                          <th className="bg-base-200">Date</th>
                          <th className="bg-base-200">Status</th>
                          <th className="bg-base-200">Payment</th>
                          <th className="bg-base-200">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentOrders.map((order, index) => (
                          <tr
                            key={order.id}
                            className="hover cursor-pointer"
                            onClick={() => router.push(`/vendor/orders/${order.id}`)}
                          >
                            <td className="font-medium">
                              #{currentPage * pageSize + index + 1}
                            </td>
                            <td>
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                            <td>
                              <div className="flex items-center">
                                <div
                                  className={`badge ${
                                    order.fulfillment_status === "not_fulfilled"
                                      ? "badge-warning"
                                      : "badge-success"
                                  } badge-sm mr-2`}
                                ></div>
                                <span className="capitalize">
                                  {order.fulfillment_status.replace(/_/g, " ")}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="flex items-center">
                                <div
                                  className={`badge ${
                                    order.status === "pending"
                                      ? "badge-warning"
                                      : "badge-success"
                                  } badge-sm mr-2`}
                                ></div>
                                <span className="capitalize">{order.status}</span>
                              </div>
                            </td>
                            <td className="font-medium">${order.total_amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      totalItems={customerOrders.length}
                      data={currentOrders}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-base-200 p-4">
                      <svg
                        className="w-8 h-8 text-secondary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">No Orders Yet</h3>
                  <p className="text-base-content opacity-70 mt-1">
                    {"This customer hasn't placed any orders."}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};


const CustomerDetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-8">
        <div className="flex items-center space-x-6">
          <div className="skeleton h-20 w-20 rounded-lg"></div>
          <div className="space-y-3">
            <div className="skeleton h-6 w-48"></div>
            <div className="skeleton h-4 w-64"></div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="stats stats-vertical lg:stats-horizontal bg-base-200">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat">
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-6 w-24 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-6 border-b border-base-300">
        <div className="skeleton h-6 w-32"></div>
        <div className="skeleton h-4 w-48 mt-2"></div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-8 w-full"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CustomerDetails;
