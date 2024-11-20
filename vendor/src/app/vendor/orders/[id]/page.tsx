"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetOrder } from "@/app/hooks/orders/useGetOrder";
import { BackButton } from "@/app/utils/backButton";
import { FiMail } from "react-icons/fi";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { ChevronDownMini, ChevronUpMini, User, Phone } from "@medusajs/icons";
import PrintOrder from "../printOrder";

const OrderDetailsView = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrder(id as string);
  const { data: customers } = useGetCustomers();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [selectedDesigns, setSelectedDesigns] = useState<
    Record<string, number>
  >({});
  const [selectedImageType, setSelectedImageType] = useState<
    Record<string, "apparel" | "uploaded">
  >({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showRawOrderData, setShowRawOrderData] = useState(false);

  const matchingCustomers = customers?.filter(
    (customer) => customer?.id === order?.customer_id
  );

  if (isLoading) return <OrderDetailsSkeleton />;
  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Order not found</p>
      </div>
    );
  }

  const taxRate = 0.1;
  const totalAmount = parseFloat(order.total_amount);
  const subtotalAmount = totalAmount / (1 + taxRate);
  const taxAmount = totalAmount - subtotalAmount;

  const handleThumbnailClick = (itemId: string, designIndex: number) => {
    setSelectedDesigns((prev) => ({ ...prev, [itemId]: designIndex }));
  };

  const toggleImageType = (productId) => {
    setSelectedImageType((prev) => ({
      ...prev,
      [productId]: prev[productId] === "apparel" ? "uploaded" : "apparel",
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        ring: "ring-emerald-600/20",
        label: "Completed",
      },
      pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        ring: "ring-amber-600/20",
        label: "Pending",
      },
      cancelled: {
        bg: "bg-red-50",
        text: "text-red-700",
        ring: "ring-red-600/20",
        label: "Cancelled",
      },
      default: {
        bg: "bg-gray-50",
        text: "text-gray-700",
        ring: "ring-gray-600/20",
        label: status,
      },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.default;

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ring-1 ring-inset ${config.ring}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton name="Orders" className="mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Order Details
              </h1>
              <p className="mt-1 text-sm text-gray-500">Order ID: {order.id}</p>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {order.line_items.map((item, itemIndex) => {
              const selectedDesignIndex = selectedDesigns[item.product_id] || 0;
              const selectedDesign = item.designs[selectedDesignIndex];
              const imageType = selectedImageType[item.product_id] || "apparel";
              const hasUploadedImages =
                selectedDesign.uploadedImages?.length > 0;
              const currentUploadedImageIndex =
                currentImageIndex[item.product_id] || 0;

              return (
                <div
                  key={item.product_id}
                  className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-gray-900">
                        Item {itemIndex + 1}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between gap-4">
                      {/* Main Image Display */}
                      <div className="relative w-[400px] h-[400px] bg-gray-50 rounded-lg overflow-hidden ring-1 ring-gray-200">
                        {imageType === "apparel" ? (
                          <>
                            <Image
                              src={selectedDesign.apparel.url}
                              alt={`${selectedDesign.apparel.side} view`}
                              fill
                              sizes="100%"
                              priority
                              className="object-cover"
                              style={{
                                backgroundColor: selectedDesign.apparel?.color,
                              }}
                            />
                            {selectedDesign.pngImage && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                  className="relative"
                                  style={{
                                    top:
                                      selectedDesign.apparel.side ===
                                      "leftshoulder"
                                        ? "35px"
                                        : selectedDesign.apparel.side ===
                                          "rightshoulder"
                                        ? "30px"
                                        : "initial",
                                    left:
                                      selectedDesign.apparel.side ===
                                      "leftshoulder"
                                        ? "-10px"
                                        : selectedDesign.apparel.side ===
                                          "rightshoulder"
                                        ? "8px"
                                        : "initial",
                                    width: [
                                      "leftshoulder",
                                      "rightshoulder",
                                    ].includes(selectedDesign.apparel.side)
                                      ? "30%"
                                      : "50%",
                                    height: [
                                      "leftshoulder",
                                      "rightshoulder",
                                    ].includes(selectedDesign.apparel.side)
                                      ? "30%"
                                      : "50%",
                                  }}
                                >
                                  <Image
                                    src={selectedDesign.pngImage}
                                    alt="Design"
                                    fill
                                    sizes="100%"
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          hasUploadedImages && (
                            <Image
                              src={
                                selectedDesign.uploadedImages[
                                  currentUploadedImageIndex
                                ]
                              }
                              alt={`Uploaded design ${
                                currentUploadedImageIndex + 1
                              }`}
                              fill
                              sizes="100%"
                              className="object-contain"
                            />
                          )
                        )}
                      </div>

                      {/* Vertical Thumbnails and Controls */}
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-2">
                          {item.designs.map((design, index) => (
                            <button
                              key={index}
                              onClick={() =>
                                handleThumbnailClick(item.product_id, index)
                              }
                              className={`relative w-24 h-24 rounded-lg overflow-hidden transition-all ${
                                selectedDesignIndex === index
                                  ? "ring-2 ring-blue-500"
                                  : "ring-1 ring-gray-200 hover:ring-2 hover:ring-blue-200"
                              }`}
                            >
                              <Image
                                src={design.apparel?.url}
                                alt={`Side: ${design.apparel.side}`}
                                fill
                                sizes="100%"
                                priority
                                className="object-cover"
                                style={{
                                  backgroundColor: design.apparel?.color,
                                }}
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/50 py-1">
                                <span className="text-[10px] text-white text-center block">
                                  {design.apparel.side}
                                </span>
                              </div>
                              {design.pngImage && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div
                                    className="relative"
                                    style={{
                                      width: [
                                        "leftshoulder",
                                        "rightshoulder",
                                      ].includes(design.apparel.side)
                                        ? "30%"
                                        : "50%",
                                      height: [
                                        "leftshoulder",
                                        "rightshoulder",
                                      ].includes(design.apparel.side)
                                        ? "30%"
                                        : "50%",
                                    }}
                                  >
                                    <Image
                                      src={design.pngImage}
                                      alt="Design preview"
                                      fill
                                      sizes="100%"
                                      className="object-contain"
                                    />
                                  </div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>

                        {hasUploadedImages && (
                          <div className="space-y-4">
                            <button
                              onClick={() => toggleImageType(item.product_id)}
                              className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              {imageType === "apparel"
                                ? "View Uploaded Design"
                                : "View on Apparel"}
                            </button>

                            {imageType === "uploaded" && (
                              <div className="flex flex-col space-y-2">
                                {selectedDesign.uploadedImages.map(
                                  (image, index) => (
                                    <button
                                      key={index}
                                      onClick={() =>
                                        setCurrentImageIndex((prev) => ({
                                          ...prev,
                                          [item.product_id]: index,
                                        }))
                                      }
                                      className={`relative w-24 h-24 rounded-lg overflow-hidden transition-all ${
                                        currentUploadedImageIndex === index
                                          ? "ring-2 ring-blue-500"
                                          : "ring-1 ring-gray-200 hover:ring-2 hover:ring-blue-200"
                                      }`}
                                    >
                                      <Image
                                        src={image}
                                        alt={`Design ${index + 1}`}
                                        fill
                                        sizes="100%"
                                        className="object-cover"
                                      />
                                    </button>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
              <div className="p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Customer Information
                </h2>
                {matchingCustomers?.length > 0 ? (
                  matchingCustomers.map((customer, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{`${customer.first_name} ${customer.last_name}`}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{customer.phone || "Not provided"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center text-sm text-gray-600">
                    <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{order.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
              <div className="p-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Order Status
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1.5">
                      Payment Status
                    </p>
                    {getStatusBadge(order.payment_status)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1.5">
                      Fulfillment Status
                    </p>
                    {getStatusBadge(order.fulfillment_status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-900/5 overflow-hidden">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Summary
                  </h2>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    <PrintOrder
                      order={order}
                      selectedDesigns={selectedDesigns}
                      currentImageIndex={currentImageIndex}
                    />
                  </button>
                </div>

                {/* Order Details */}
                <div className="space-y-4">

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        ${subtotalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-900">
                        ${taxAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Raw Order Data */}
        <div className="mt-8 bg-white rounded-xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Raw Order Data
              </h2>
              <button
                onClick={() => setShowRawOrderData(!showRawOrderData)}
                className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-900"
              >
                <span>{showRawOrderData ? "Hide" : "Show"} Details</span>
                {showRawOrderData ? (
                  <ChevronUpMini className="w-4 h-4" />
                ) : (
                  <ChevronDownMini className="w-4 h-4" />
                )}
              </button>
            </div>
            {showRawOrderData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg overflow-auto">
                <pre className="text-xs text-gray-600 font-mono">
                  {JSON.stringify(order, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-32 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-[400px] bg-gray-200 rounded-lg mb-4"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-20 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-5 bg-gray-200 rounded-lg w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-4/6"></div>
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
