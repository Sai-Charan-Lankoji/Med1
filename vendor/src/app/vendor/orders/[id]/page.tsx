"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetOrder } from "@/app/hooks/orders/useGetOrder";
import { BackButton } from "@/app/utils/backButton";
import { FiMail } from "react-icons/fi";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { ChevronDownMini, ChevronUpMini, User, Phone } from "@medusajs/icons";

const OrderDetailsView = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrder(id as string);
  const { data: customers } = useGetCustomers();
  const [expandedItem, setExpandedItem] = React.useState<number | null>(null);
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

  const taxRate = 0.1; // change this in case of tax changes
  const totalAmount = parseFloat(order.total_amount);
  const subtotalAmount = totalAmount / (1 + taxRate);
  const taxAmount = totalAmount - subtotalAmount;
  const toggleItemExpansion = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleThumbnailClick = (itemId: string, designIndex: number) => {
    setSelectedDesigns((prev) => ({
      ...prev,
      [itemId]: designIndex,
    }));
  };

  const toggleImageType = (productId) => {
    setSelectedImageType((prev) => ({
      ...prev,
      [productId]: prev[productId] === "apparel" ? "uploaded" : "apparel",
    }));
  };

  const capitalizeFirstLetter = (string: String) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getDesignedSidesText = (designs: { apparel: { side: string } }[]) => {
    if (!designs || designs.length === 0) return "";
    const sides = designs.map((design) =>
      capitalizeFirstLetter(design.apparel.side)
    );
    if (sides.length === 1) return sides[0];
    if (sides.length === 2) return `${sides[0]} & ${sides[1]}`;
    const lastSide = sides.pop();
    return `${sides.join(", ")} & ${lastSide}`;
  };
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <BackButton name="orders" className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-500">Order ID: {order.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-lg font-medium mb-4">
                    Item {itemIndex + 1}
                  </h3>

                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    {/* Main Design Display */}
                    <div className="relative w-full md:w-96 h-96 bg-gray-50 rounded-lg">
                      {imageType === "apparel" ? (
                        <>
                          <Image
                            src={selectedDesign.apparel.url}
                            alt={`${selectedDesign.apparel.side} view`}
                            fill
                            sizes="100%"
                            priority
                            className="rounded-none border"
                            style={{
                              backgroundColor: selectedDesign.apparel?.color,
                              objectFit: "cover",
                            }}
                          />
                          {selectedDesign.pngImage && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div
                                className="relative w-1/2 h-1/2"
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
                                  width:
                                    selectedDesign.apparel.side ===
                                      "leftshoulder" ||
                                    selectedDesign.apparel.side ===
                                      "rightshoulder"
                                      ? "30%"
                                      : "50%",
                                  height:
                                    selectedDesign.apparel.side ===
                                      "leftshoulder" ||
                                    selectedDesign.apparel.side ===
                                      "rightshoulder"
                                      ? "30%"
                                      : "50%",
                                }}
                              >
                                <Image
                                  src={selectedDesign.pngImage}
                                  alt="Design"
                                  fill
                                  sizes="100%"
                                  className="rounded-md"
                                  style={{ objectFit: "contain" }}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        hasUploadedImages && (
                          <div className="relative w-full h-full ">
                            <Image
                              src={
                                selectedDesign.uploadedImages[
                                  currentUploadedImageIndex
                                ]
                              }
                              alt={`Uploaded design ${
                                currentUploadedImageIndex + 1
                              }`}
                              layout="fill"
                              objectFit="contain"
                              className="rounded-lg"
                            />
                          </div>
                        )
                      )}
                    </div>

                    {/* Thumbnails and Image Type Toggle */}
                    <div className="space-y-4">
                      <div className="flex flex-row md:flex-col gap-2">
                        {item.designs.map((design, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleThumbnailClick(item.product_id, index)
                            }
                            className={`relative w-20 h-20 rounded-lg transition-all ${
                              selectedDesignIndex === index
                                ? "ring-2 ring-blue-500"
                                : "hover:ring-2 hover:ring-gray-300"
                            }`}
                          >
                            <Image
                              src={design.apparel?.url}
                              alt={`Side: ${design.apparel.side}`}
                              fill
                              sizes="100%"
                              priority
                              className="rounded-none"
                              style={{
                                backgroundColor: design.apparel?.color,
                                objectFit: "cover",
                              }}
                            />
                            <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center rounded-b-lg">
                              {design.apparel.side}
                            </span>
                            {design.uploadedImages?.length > 0 && (
                              <div className="absolute top-1 right-1 w-3 h-3  rounded-md" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div
                                className="relative translate-y-[-10%]"
                                style={{
                                  top:
                                    design.apparel.side === "leftshoulder"
                                      ? "12px"
                                      : design.apparel.side === "rightshoulder"
                                      ? "12px"
                                      : "initial",
                                  left:
                                    design.apparel.side === "leftshoulder"
                                      ? "-3px"
                                      : design.apparel.side === "rightshoulder"
                                      ? "2px"
                                      : "initial",
                                  width:
                                    design.apparel.side === "leftshoulder" ||
                                    design.apparel.side === "rightshoulder"
                                      ? "30%"
                                      : "50%",
                                  height:
                                    design.apparel.side === "leftshoulder" ||
                                    design.apparel.side === "rightshoulder"
                                      ? "30%"
                                      : "50%",
                                }}
                              >
                                <Image
                                  src={design.pngImage}
                                  alt={`Thumbnail ${index + 1}`}
                                  fill
                                  sizes="100%"
                                  className="rounded-md"
                                  style={{ objectFit: "contain" }}
                                />
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {hasUploadedImages && (
                        <>
                          <button
                            onClick={() => toggleImageType(item.product_id)}
                            className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            {imageType === "apparel"
                              ? "Show Uploaded Design"
                              : "Show Apparel Preview"}
                          </button>

                          {/* Uploaded Images Thumbnails */}
                          {imageType === "uploaded" && (
                            <div className="flex flex-wrap gap-2 mt-4">
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
                                    className={`relative w-16 h-16 rounded-lg transition-all ${
                                      currentUploadedImageIndex === index
                                        ? "ring-2 ring-blue-500"
                                        : "hover:ring-2 hover:ring-gray-300"
                                    }`}
                                  >
                                    <Image
                                      src={image}
                                      alt={`Uploaded design thumbnail ${
                                        index + 1
                                      }`}
                                      layout="fill"
                                      objectFit="cover"
                                      className="rounded-lg"
                                    />
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rest of the component remains the same */}
          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                  Customer
                </h2>
                <div>
                  {matchingCustomers?.length > 0 ? (
                    matchingCustomers.map((customer, index) => (
                      <div key={index} className="space-y-2 sm:space-y-3">
                        <div className="flex items-center text-xs sm:text-sm">
                          <User className="text-gray-400 mr-2 flex-shrink-0" />
                          <span className="truncate">{`${customer.first_name} ${customer.last_name}`}</span>
                        </div>
                        <div className="flex  items-center text-xs sm:text-sm">
                          <FiMail className="text-gray-400 ml-1 mr-2 flex-shrink-0" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm">
                          <Phone className="text-gray-400 mr-2 flex-shrink-0" />
                          <span className="truncate">{customer.phone}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs sm:text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiMail className="text-gray-400 mr-2 flex-shrink-0" />
                        <span className="truncate">{order.email}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Order Status</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Status</p>
                  {getStatusBadge(order.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  {getStatusBadge(order.payment_status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Fulfillment Status
                  </p>
                  {getStatusBadge(order.fulfillment_status)}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>${subtotalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-medium">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Raw Order Data Section */}
        <div className="mb-6 mt-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl mb-2">Raw Order Details</h2>
          <div className="flex flex-row justify-between">
            <button
              onClick={() => setShowRawOrderData(!showRawOrderData)}
              className="flex items-center space-x-2 mt-4 px-4 py-2 text-slate-900 rounded-md hover:bg-gray-50"
            >
              <span className="text-sm text-gray-400">
                .... ({Object.keys(order).length} items)
              </span>
              {showRawOrderData ? (
                <ChevronUpMini className="h-4 w-4" />
              ) : (
                <ChevronDownMini className="h-4 w-4" />
              )}
            </button>
          </div>
          {showRawOrderData && (
            <pre className="mt-4 p-4 bg-gray-100 rounded-md text-sm text-blue-800 overflow-auto">
              {JSON.stringify(order, null, 2)}
            </pre>
          )}
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
