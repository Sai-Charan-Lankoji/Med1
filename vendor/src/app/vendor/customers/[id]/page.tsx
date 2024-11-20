"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Container,
  Table,
} from "@medusajs/ui";
import {
  ChevronDownMini,
  ChevronUpMini,
} from "@medusajs/icons";
import Pagination from "@/app/utils/pagination";
import { BackButton } from "@/app/utils/backButton";
import { useGetCustomer } from "@/app/hooks/customer/useGetCustomer";
import { useGetOrders } from "@/app/hooks/orders/useGetOrders";

const Customer = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showRawData, setShowRawData] = useState(false);
  const router = useRouter()
  const params = useParams();
  const customerId = params?.id as string | undefined;
  const { data: customer } = useGetCustomer(customerId);
  const { data: orders } = useGetOrders();
  const customerOrders = orders?.filter(
    (order) => order.customer_id === customer?.id
  );
  const pageSize = 5;

  const currentOrders = useMemo(() => {
    if (!orders) return [];
    const offset = currentPage * pageSize;
    const limit = Math.min(offset + pageSize, orders.length);
    return orders.slice(offset, limit);
  }, [currentPage, orders, pageSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackButton name="Customers" />
        
        {!customer ? (
          <CustomerDetailsSkeleton />
        ) : (
          <>
            {/* Customer Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden backdrop-blur-sm">
              <div className="p-8">
                <div className="flex items-center space-x-6">
                  <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-2xl w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                    {customer.first_name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-800">
                      {customer.first_name} {customer.last_name}
                    </h2>
                    <p className="text-slate-500 mt-1">{customer.email}</p>
                  </div>
                </div>

                <div className="mt-8 flex divide-x divide-slate-200">
                  <div className="px-6 first:pl-0">
                    <p className="text-sm font-medium text-slate-400">First seen</p>
                    <p className="mt-1 text-slate-700">
                      {new Date(customer.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="px-6">
                    <p className="text-sm font-medium text-slate-400">Phone</p>
                    <p className="mt-1 text-slate-700">{customer.phone || "Not provided"}</p>
                  </div>
                  <div className="px-6">
                    <p className="text-sm font-medium text-slate-400">Total Orders</p>
                    <p className="mt-1 text-slate-700">{customerOrders?.length || 0}</p>
                  </div>
                  <div className="px-6">
                    <p className="text-sm font-medium text-slate-400">Account Status</p>
                    <div className="mt-1 flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        customer.has_account ? "bg-emerald-500" : "bg-rose-500"
                      }`} />
                      <span className="text-slate-700">
                        {customer.has_account ? "Registered" : "Guest"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800">
                  Orders History
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Overview of customer purchase history
                </p>
              </div>

              {customerOrders?.length ? (
                <div className="p-6">
                  <Table>
                    <Table.Header>
                      <Table.Row className="bg-slate-50">
                        <Table.HeaderCell className="text-slate-600">Order</Table.HeaderCell>
                        <Table.HeaderCell className="text-slate-600">Date</Table.HeaderCell>
                        <Table.HeaderCell className="text-slate-600">Status</Table.HeaderCell>
                        <Table.HeaderCell className="text-slate-600">Payment</Table.HeaderCell>
                        <Table.HeaderCell className="text-slate-600">Total</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {customerOrders?.map((order, index) => (
                        <Table.Row key={order.id} className="hover:bg-slate-50/50 transition-colors hover:cursor-pointer" onClick={() => {
                          router.push(`/vendor/orders/${order.id}`);
                        }}>
                          <Table.Cell className="font-medium text-slate-900">
                            #{index + 1}
                          </Table.Cell>
                          <Table.Cell>
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex items-center">
                              <span className={`h-2 w-2 rounded-full mr-2 ${
                                order.fulfillment_status === "not_fulfilled"
                                  ? "bg-amber-400"
                                  : "bg-emerald-400"
                              }`} />
                              <span className="capitalize text-slate-700">
                                {order.fulfillment_status.replace(/_/g, " ")}
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex items-center">
                              <span className={`h-2 w-2 rounded-full mr-2 ${
                                order.status === "pending"
                                  ? "bg-amber-400"
                                  : "bg-emerald-400"
                              }`} />
                              <span className="capitalize text-slate-700">
                                {order.status}
                              </span>
                            </div>
                          </Table.Cell>
                          <Table.Cell className="font-medium text-slate-900">
                            ${order.total_amount}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>

                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      totalItems={customerOrders?.length ?? 0}
                      data={currentOrders}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">No Orders Yet</h3>
                  <p className="text-slate-500 mt-1">This customer hasn&apos;t placed any orders.</p>
                </div>
              )}
            </div>

            {/* Raw Data Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Raw Customer Data
                  </h2>
                  <Button
                    variant="transparent"
                    onClick={() => setShowRawData(!showRawData)}
                    className="flex items-center space-x-2 text-slate-600 hover:text-slate-900"
                  >
                    <span className="text-sm">
                      {showRawData ? "Hide" : "Show"} Details
                    </span>
                    {showRawData ? <ChevronUpMini /> : <ChevronDownMini />}
                  </Button>
                </div>
                
                {showRawData && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl overflow-auto">
                    <pre className="text-sm font-mono text-slate-800">
                      {JSON.stringify(customer, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Customer;

const CustomerDetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden p-8">
      <div className="animate-pulse">
        <div className="flex items-center space-x-6">
          <div className="bg-slate-200 rounded-2xl h-20 w-20"></div>
          <div className="space-y-3">
            <div className="h-6 bg-slate-200 rounded w-48"></div>
            <div className="h-4 bg-slate-200 rounded w-64"></div>
          </div>
        </div>

        <div className="mt-8 flex divide-x divide-slate-200">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="px-6 first:pl-0 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-20"></div>
              <div className="h-4 bg-slate-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="h-6 bg-slate-200 rounded w-32"></div>
        <div className="h-4 bg-slate-200 rounded w-48 mt-2"></div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-8 bg-slate-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);