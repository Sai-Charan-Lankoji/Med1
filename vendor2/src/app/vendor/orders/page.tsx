"use client";

import React, { useCallback, useMemo, useState } from "react";
import withAuth from "@/lib/withAuth";
import { useGetOrders } from "@/app/hooks/orders/useGetOrders";
import { useGetSalesChannels } from "@/app/hooks/saleschannel/useGetSalesChannels";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { useRouter } from "next/navigation";
import Pagination from "@/app/utils/pagination";
import { Search, Eye, RefreshCw, Filter, Package, User, CreditCard, Store, Calendar, DollarSign } from "lucide-react";
import { parseISO, format, parse, isValid } from "date-fns";
import { useGetStores } from "@/app/hooks/store/useGetStores";

const Order = () => {
  const { data: OrdersData, isLoading: ordersLoading, refetch: refetchOrders } = useGetOrders();
  const { data: saleschannelsData } = useGetSalesChannels();
  const { data: customersData, isLoading: customersLoading } = useGetCustomers();
  const { data: stores, isLoading: storesLoading } = useGetStores();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const router = useRouter();
  const pageSize = 8;

  const getCustomerFirstName = useCallback(
    (customerId) => {
      const customer = customersData?.find(
        (customer) => customer.id === customerId
      );
      return customer ? `${customer.first_name} ${customer.last_name}` : "N/A";
    },
    [customersData]
  );

  const formatTimestamp = (timestamp) => {
    const date = parseISO(timestamp);
    return format(date, "dd MMM yyyy hh:mm a").toLocaleString();
  };

  const formatDate = (timestamp) => {
    const date = parseISO(timestamp);
    return format(date, "dd-MM-yyyy");
  };

  const parseDateString = (dateString) => {
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
    if (!OrdersData || !customersData || !stores) return [];

    const searchLower = searchQuery.toLowerCase();
    const searchDate = parseDateString(searchQuery);

    return OrdersData.filter((order) => {
      const orderDate = parseISO(order.createdAt);
      const matchesSearch =
        getCustomerFirstName(order.customer_id)
          .toLowerCase()
          .includes(searchLower) ||
        order.payment_status.toLowerCase().includes(searchLower) ||
        order.status.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower) ||
        (searchDate &&
          format(orderDate, "dd-MM-yyyy") === format(searchDate, "dd-MM-yyyy"));

      const matchesStore =
        selectedStore === "all" || order.store_id === selectedStore;

      const matchesStatus =
        selectedStatus === "all" || 
        (selectedStatus === "payment" && order.payment_status === "captured") ||
        (selectedStatus === "pending" && order.payment_status !== "captured");

      return matchesSearch && matchesStore && matchesStatus;
    });
  }, [OrdersData, customersData, stores, searchQuery, selectedStore, selectedStatus, getCustomerFirstName]);

  const paginatedOrders = useMemo(() => {
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage, pageSize]);

  const getRowIndex = (index) => {
    return currentPage * pageSize + index + 1;
  };

  const getStoreName = (storeId) => {
    const store = stores?.find((s) => s.id === storeId);
    return store ? store.name : "N/A";
  };

  const handleFetchOrders = () => {
    refetchOrders();
  };
  
  const OrderSkeleton = () => {
    return (
      <div className="p-4 md:p-6 container mx-auto max-w-7xl">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="flex justify-between mb-6">
            <div>
              <div className="h-8 w-48 bg-base-200 rounded-lg mb-2"></div>
              <div className="h-4 w-64 bg-base-200 rounded-lg"></div>
            </div>
            <div className="h-10 w-24 bg-base-200 rounded-lg"></div>
          </div>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-base-100 p-6 rounded-lg">
                <div className="h-5 w-24 mb-2 bg-base-200 rounded"></div>
                <div className="h-8 w-16 mb-2 bg-base-200 rounded"></div>
                <div className="h-4 w-20 bg-base-200 rounded"></div>
              </div>
            ))}
          </div>
          
          {/* Filters Skeleton */}
          <div className="bg-base-100 p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="h-10 w-48 bg-base-200 rounded-lg"></div>
              <div className="h-10 flex-1 bg-base-200 rounded-lg"></div>
            </div>
          </div>
          
          {/* Table Skeleton */}
          <div className="bg-base-100 rounded-lg overflow-hidden">
            <div className="flex p-4 bg-base-200">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-6 flex-1 bg-base-300 rounded mx-2"></div>
              ))}
            </div>
            
            {[...Array(6)].map((_, rowIndex) => (
              <div key={rowIndex} className="flex p-4 border-b border-base-200">
                {[...Array(8)].map((_, colIndex) => (
                  <div key={colIndex} className="h-10 flex-1 bg-base-200 rounded mx-2"></div>
                ))}
              </div>
            ))}
            
            <div className="p-4 border-t border-base-200">
              <div className="h-8 w-full bg-base-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (ordersLoading || customersLoading || storesLoading) {
    return <OrderSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 container mx-auto max-w-9xl bg-base-200 rounded-box">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
            <Package className="h-6 w-6" /> Orders
          </h2>
          <p className="text-base-content/70 text-sm mt-1">
            Manage and track your orders efficiently
          </p>
        </div>

        <button
          onClick={handleFetchOrders}
          className="btn btn-sm btn-primary btn-soft mt-4 sm:mt-0 self-start sm:self-auto gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stats stats-vertical sm:stats-horizontal bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Package className="w-6 h-6" />
            </div>
            <div className="stat-title">Total Orders</div>
            <div className="stat-value text-primary">{OrdersData?.length || 0}</div>
            <div className="stat-desc">All time orders</div>
          </div>
        </div>

        <div className="stats stats-vertical sm:stats-horizontal bg-base-100">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="stat-title">Completed</div>
            <div className="stat-value text-secondary">
              {OrdersData?.filter(o => o.payment_status === "captured").length || 0}
            </div>
            <div className="stat-desc">Captured payments</div>
          </div>
        </div>

        <div className="stats stats-vertical sm:stats-horizontal bg-base-100">
          <div className="stat">
            <div className="stat-figure text-accent">
              <User className="w-6 h-6" />
            </div>
            <div className="stat-title">Customers</div>
            <div className="stat-value text-accent">{customersData?.length || 0}</div>
            <div className="stat-desc">Unique customers</div>
          </div>
        </div>

        <div className="stats stats-vertical sm:stats-horizontal bg-base-100">
          <div className="stat">
            <div className="stat-figure text-neutral">
              <Store className="w-6 h-6" />
            </div>
            <div className="stat-title">Stores</div>
            <div className="stat-value text-neutral">{stores?.length || 0}</div>
            <div className="stat-desc">Active stores</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-base-100 p-4 rounded-lg card-border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <Filter className="w-4 h-4 text-base-content/70" />
            <span className="font-medium text-sm">Filters:</span>
          </div>
          
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            {/* Updated to use join component */}
            <div className="join flex-1">
              <input
                type="text"
                placeholder="Search by customer, ID, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input join-item flex-grow"
              />
              <button className="btn btn-primary join-item">
                <Search className="w-4 h-4" />
              </button>
            </div>
            
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="select w-full md:w-48"
            >
              <option value="all">All Stores</option>
              {stores?.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select w-full md:w-48"
            >
              <option value="all">All Payment Status</option>
              <option value="payment">Payment Captured</option>
              <option value="pending">Payment Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table or No Data */}
      <div className="flex flex-col gap-6 shadow-2xl">
        {filteredOrders.length === 0 ? (
          <div className="card card-border bg-base-100 shadow-2xl rounded-full">
            <div className="card-body items-center text-center">
              <div className="bg-base-200 p-8 rounded-full mb-4">
                <Package className="w-12 h-12 text-base-content/40" />
              </div>
              <h2 className="card-title text-xl">No Orders Found</h2>
              <p className="text-base-content/70 mb-4">
                No orders match your current search criteria
              </p>
              <div className="card-actions">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStore("all");
                    setSelectedStatus("all");
                  }}
                  className="btn btn-outline btn-primary"
                >
                  Clear Filters
                </button>
                <button
                  onClick={handleFetchOrders}
                  className="btn btn-primary btn-soft"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Retry
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card card-border bg-base-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200 text-base-content">
                    <th className="text-center">
                      <div className="flex items-center justify-center">
                        <span>#</span>
                      </div>
                    </th>
                    <th className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Date</span>
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>Customer</span>
                      </div>
                    </th>
                    <th className="text-center">Fulfillment</th>
                    <th className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        <span>Payment</span>
                      </div>
                    </th>
                    <th className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Store className="w-4 h-4" />
                        <span>Store</span>
                      </div>
                    </th>
                    <th className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>Total</span>
                      </div>
                    </th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className="hover:bg-base-200/50 transition-colors duration-200"
                    >
                      <td className="text-center font-medium">{getRowIndex(index)}</td>
                      <td className="text-center">
                        <div className="flex flex-col">
                          <span className="font-medium">{formatDate(order.createdAt)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar avatar-placeholder">
                            <div className="w-8 rounded-full bg-primary text-primary-content">
                              <span>
                                {getCustomerFirstName(order.customer_id).charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{getCustomerFirstName(order.customer_id)}</div>
                            <div className="text-xs text-base-content/70">{order.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${
                          order.fulfillment_status === "fulfilled" 
                            ? "badge-success badge-soft" 
                            : "badge-secondary badge-soft"
                        }`}>
                          {order.fulfillment_status}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${
                          order.payment_status === "captured" 
                            ? "badge-success badge-soft" 
                            : "badge-warning badge-soft"
                        }`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="badge badge-outline">
                          {getStoreName(order.store_id)}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="font-medium">
                          {order.total_amount}
                          <span className="text-xs ml-1 text-base-content/70">
                            {order.currency_code.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => router.push(`/vendor/orders/${order.id}`)}
                          className="btn btn-sm btn-circle btn-primary btn-soft"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-base-200">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={filteredOrders.length}
                data={filteredOrders}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
    
export default withAuth(Order);