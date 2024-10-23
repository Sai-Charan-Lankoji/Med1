"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetOrder } from "@/app/hooks/orders/useGetOrder";
import { useGetCustomerByEmail } from "@/app/hooks/customer/useGetCustomerByEmail";
import { BackButton } from "@/app/utils/backButton";
import {
  FiPackage,
  FiCreditCard,
  FiUser,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiPhone,
} from "react-icons/fi";

const OrderDetailsView = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrder(id as string);
  const email = order?.email;
  const { data: customers } = useGetCustomerByEmail(email);
  const [expandedItem, setExpandedItem] = React.useState<number | null>(null);

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Order not found</p>
      </div>
    );
  }

const taxRate = 0.10; // change this in case of tax changes
const totalAmount = parseFloat(order.total_amount);
const subtotalAmount = totalAmount / (1 + taxRate);
const taxAmount = totalAmount - subtotalAmount; 
  const toggleItemExpansion = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };
  console.log("order",order)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Completed",
      },
      pending: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Pending",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Cancelled",
      },
      default: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: status,
      },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.default;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <BackButton name="orders" className="mb-6" />

        {/* Order Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between sm:items-start  mb-8 space-y-4 sm:space-y-0">
  <div className="flex flex-col space-y-2 sm:mb-5">
    <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
    <p className="text-sm text-gray-500">Order-ID: {id}</p>
  </div>
  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
    <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2">
      <FiCreditCard className="mr-2 h-4 w-4" />
      Update Payment
    </button>
    <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2">
      <FiPackage className="mr-2 h-4 w-4" />
      Update Fulfillment
    </button>
  </div>
</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">
                  Order Status
                </h3>
                <div className="mt-2">{getStatusBadge(order.status)}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">
                  Payment Status
                </h3>
                <div className="mt-2">
                  {getStatusBadge(order.payment_status)}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">
                  Fulfillment Status
                </h3>
                <div className="mt-2">
                  {getStatusBadge(order.fulfillment_status)}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Items
                </h2>
                <div className="space-y-4">
                  {order.line_items.map((item, index) => (
                    <div key={index} className="border rounded-lg">
                      <div className="p-4">
                        <div className="flex items-center">
                          <div className="w-20 h-20 relative flex-shrink-0">
                            <Image
                              src={item.thumbnail_url || "/vercel.svg"}
                              alt={`Image`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                          <div className="ml-6 flex-1">
                          <div className="ml-auto flex flex-col items-end">
                            <div className="mt-1 mr-2 flex items-center text-sm text-gray-900">
                              Quantity: {item.quantity}
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-900">
                              {order.currency_code.toUpperCase()}{" "}
                              {item.price.toFixed(2)}
                            </div>
                          </div>
                          </div>
                         {/*  <button
                            onClick={() => toggleItemExpansion(index)}
                            className="ml-4 text-gray-400 hover:text-gray-600"
                          >
                            {expandedItem === index ? (
                              <FiChevronUp size={20} />
                            ) : (
                              <FiChevronDown size={20} />
                            )}
                          </button> */}
                        </div>
                       {/* {expandedItem === index && item.uploadImage_url && (
                          <div className="mt-4 border-t pt-4">
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              Custom Design
                            </p>
                            <div className="w-full h-48 relative bg-gray-50 rounded-lg">
                              <Image
                                src={item.uploadImage_url}
                                alt="Custom Design"
                                layout="fill"
                                objectFit="contain"
                                className="rounded-lg"
                              />
                            </div>
                          </div>
                        )}  */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Customer
                </h2>
                {customers && customers.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <FiUser className="text-gray-400 mr-2" />
                      <span>{`${customers[0].first_name} ${customers[0].last_name}`}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FiMail className="text-gray-400 mr-2" />
                      <span>{order.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FiPhone className="text-gray-400 mr-2" />
                      <span>{customers[0].phone}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-2" />
                      <span>{order.email}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      {order.currency_code.toUpperCase()}{" "}
                      {parseFloat(subtotalAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-900 font-medium">
                      {order.currency_code.toUpperCase()}{" "}
                      {parseFloat(taxAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-base font-medium text-gray-900">
                        Total
                      </span>
                      <span className="text-base font-medium text-gray-900">
                        {order.currency_code.toUpperCase()}{" "}
                        {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
              {[1, 2].map((i) => (
                <div key={i} className="mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OrderDetailsView;
