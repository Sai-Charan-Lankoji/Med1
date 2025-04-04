"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetOrder } from "@/app/hooks/orders/useGetOrder";
import { BackButton } from "@/app/utils/backButton";
import { FiMail } from "react-icons/fi";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import {  User, Phone } from "@medusajs/icons";
import { Container } from "@medusajs/ui";
import { motion } from "framer-motion";

const OrderDetailsView = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrder(id as string);
  const { data: customers } = useGetCustomers();
  
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
  console.log("order", order);

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

  const toggleImageType = (productId: string) => {
    setSelectedImageType((prev) => ({
      ...prev,
      [productId]: prev[productId] === "apparel" ? "uploaded" : "apparel",
    }));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        bg: "bg-green-400",
        text: "text-black",
        ring: "ring-green-400/30",
        label: "Completed",
      },
      pending: {
        bg: "bg-yellow-400",
        text: "text-black",
        ring: "ring-yellow-400/30",
        label: "Pending",
      },
      cancelled: {
        bg: "bg-red-400/70",
        text: "text-black",
        ring: "ring-red-400/30",
        label: "Cancelled",
      },
      default: {
        bg: "bg-blue-400",
        text: "text-blue-200",
        ring: "ring-white",
        label: status,
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.default;

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ring-1 ring-inset ${config.ring}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="relative min-h-screen overflow-auto">
      <div className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 mb-8"
          >
            <BackButton
              name="Orders"
              className="mb-4 text-black hover:text-black transition-colors"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-black">
              Ordered Details
            </h1>
            <p className="text-sm text-black text-start">
              Order ID: {order.id}
            </p>
            <div className="mt-4 text-start text-black">
              <p>Status: {getStatusBadge(order.status)}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {order.line_items?.map((item, itemIndex) => {
                const isDesignable = !!item.designs && item.designs.length > 0;
                const selectedDesignIndex =
                  selectedDesigns[item.product_id] || 0;
                const selectedDesign = isDesignable
                  ? item.designs[selectedDesignIndex]
                  : null;
                const imageType =
                  selectedImageType[item.product_id] || "apparel";
                const hasUploadedImages =
                  isDesignable && selectedDesign?.uploadedImages?.length > 0;
                const currentUploadedImageIndex =
                  currentImageIndex[item.product_id] || 0;

                // Use images from line_items for standard products
                const standardImages = !isDesignable ? item.images || [] : [];
                const selectedStandardImageIndex =
                  selectedDesigns[item.product_id] || 0;
                const selectedStandardImage =
                  standardImages[selectedStandardImageIndex] ||
                  standardImages[0] ||
                  "/placeholder.svg";

                return (
                  <Container
                    key={item.product_id}
                    className="group p-6 bg-white/10 backdrop-blur-md border-0 border-white/20 rounded-xl shadow-2xl transition-all duration-300 hover:bg-white/20"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-black">
                        {item.title} {/* Display the title from line_items */}
                      </h3>
                      {/* <p>Product_id : {item.product_id}</p> */}

                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-black/80">
                          Quantity: {item.quantity}
                        </span>
                        <span className="text-lg font-semibold text-black">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between gap-4">
                      {/* Main Image Display */}
                      <div className="relative w-[400px] h-[400px] bg-white/10 rounded-xl overflow-hidden ring-1 ring-white/30">
                        {isDesignable && selectedDesign ? (
                          imageType === "apparel" ? (
                            <>
                              <Image
                                src={
                                  selectedDesign.apparel.url ||
                                  "/placeholder.svg"
                                }
                                alt={`${selectedDesign.apparel.side} view`}
                                fill
                                sizes="100%"
                                priority
                                className="object-cover"
                                style={{
                                  backgroundColor:
                                    selectedDesign.apparel?.color || "#ffffff",
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
                                      src={
                                        selectedDesign.pngImage ||
                                        "/placeholder.svg"
                                      }
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
                            hasUploadedImages &&
                            selectedDesign.uploadedImages?.[
                              currentUploadedImageIndex
                            ] && (
                              <Image
                                src={
                                  selectedDesign.uploadedImages[
                                    currentUploadedImageIndex
                                  ] || "/placeholder.svg"
                                }
                                alt={`Uploaded design ${
                                  currentUploadedImageIndex + 1
                                }`}
                                fill
                                sizes="100%"
                                className="object-contain"
                              />
                            )
                          )
                        ) : (
                          // Standard product: Use selected image from images array
                          <Image
                            src={selectedStandardImage}
                            alt={`${item.title} view`}
                            fill
                            sizes="100%"
                            className="object-top object-cover"
                          />
                        )}
                      </div>

                      {/* Vertical Thumbnails and Controls */}
                      <div className="flex flex-col space-y-4">
                        {isDesignable && item.designs && item.designs.length > 0 ? (
                          <div className="flex flex-col space-y-2">
                            {item.designs.map((design, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  handleThumbnailClick(item.product_id, index)
                                }
                                className={`relative w-24 h-24 rounded-lg overflow-hidden transition-all ${
                                  selectedDesignIndex === index
                                    ? "ring-2 ring-indigo-500 shadow-lg"
                                    : "ring-1 ring-indigo-200 hover:ring-2 hover:ring-indigo-300"
                                }`}
                              >
                                <Image
                                  src={
                                    design.apparel?.url || "/placeholder.svg"
                                  }
                                  alt={`Side: ${design.apparel.side}`}
                                  fill
                                  sizes="100%"
                                  priority
                                  className="object-cover"
                                  style={{
                                    backgroundColor:
                                      design.apparel?.color || "#ffffff",
                                  }}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-indigo-900/80 py-1">
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
                                        src={
                                          design.pngImage || "/placeholder.svg"
                                        }
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
                        ) : (
                          // Thumbnails for standard products
                          standardImages.length > 0 && (
                            <div className="flex flex-col space-y-2">
                              {standardImages.map((image, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleThumbnailClick(item.product_id, index)
                                  }
                                  className={`relative w-24 h-24 rounded-lg overflow-hidden transition-all ${
                                    selectedStandardImageIndex === index
                                      ? "ring-2 ring-indigo-500 shadow-lg"
                                      : "ring-1 ring-indigo-200 hover:ring-2 hover:ring-indigo-300"
                                  }`}
                                >
                                  <Image
                                    src={image || "/placeholder.svg"}
                                    alt={`View ${index + 1}`}
                                    fill
                                    sizes="100%"
                                    className="object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )
                        )}

                        {isDesignable && hasUploadedImages ? (
                          <div className="space-y-4">
                            <button
                              onClick={() => toggleImageType(item.product_id)}
                              className="w-full px-4 py-2 text-sm font-medium text-black bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                            >
                              {imageType === "apparel"
                                ? "View Uploaded Design"
                                : "View on Apparel"}
                            </button>
                          </div>
                        ) : (
                          !isDesignable && (
                            <div className="text-sm text-black/80">
                              <p>Size: {item.selected_size || "N/A"}</p>
                              <p>Color: {item.selected_color || "N/A"}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Container>
                );
              })}
            </motion.div>

            {/* Sidebar - Right Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Customer Information */}
              <Container className="p-6 bg-white/10 backdrop-blur-md border-0 border-white/20 rounded-xl shadow-2xl">
                <h2 className="text-xl font-bold text-black border-b border-white/20 mb-4 pb-4">
                  Customer Information
                </h2>
                {matchingCustomers?.length > 0 ? (
                  matchingCustomers.map((customer, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center text-sm text-black/80">
                        <User className="w-4 h-4 mr-2" />
                        <span>{`${customer.first_name} ${customer.last_name}`}</span>
                      </div>
                      <div className="flex items-center text-sm text-black/80">
                        <FiMail className="w-4 h-4 mr-2" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-black/80">
                        <Phone className="w-4 h-6 mr-2" />
                        <span>{customer.phone || "Not provided"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center text-sm text-black/80">
                    <FiMail className="w-4 h-4 mr-2" />
                    <span>{order.email}</span>
                  </div>
                )}
              </Container>

              {/* Order Summary */}
              <Container className="p-6 bg-white/10 backdrop-blur-md border-0 border-white/20 rounded-xl shadow-2xl">
                <h2 className="text-xl font-bold text-black border-b border-white/20 mb-4 pb-4">
                  Ordered Summary
                </h2>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-black/80">Subtotal</span>
                      <span className="font-medium text-black">
                        ${subtotalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-black/80">Tax</span>
                      <span className="font-medium text-black">
                        ${taxAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-white/20">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-black">
                          Total
                        </span>
                        <span className="text-xl font-bold text-black">
                          ${totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsSkeleton = () => (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
    <div className="relative z-10 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="text-center space-y-4">
            <div className="h-8 bg-black/20 rounded-lg w-48 mx-auto"></div>
            <div className="h-4 bg-black/20 rounded-lg w-32 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-black/10 backdrop-blur-md rounded-xl p-6"
                >
                  <div className="h-[400px] bg-black/20 rounded-xl mb-4"></div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div
                        key={j}
                        className="h-20 bg-black/20 rounded-lg"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-black/10 backdrop-blur-md rounded-xl p-6"
                >
                  <div className="h-5 bg-black/20 rounded-lg w-32 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-black/20 rounded-lg w-full"></div>
                    <div className="h-4 bg-black/20 rounded-lg w-5/6"></div>
                    <div className="h-4 bg-black/20 rounded-lg w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OrderDetailsView;