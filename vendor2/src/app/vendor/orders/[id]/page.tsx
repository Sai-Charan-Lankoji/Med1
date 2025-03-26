"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetOrder } from "@/app/hooks/orders/useGetOrder";
import { BackButton } from "@/app/utils/backButton";
import { FiMail } from "react-icons/fi";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { User, Phone, DollarSign, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OrderDetailsView = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrder(id as string);
  const { data: customers } = useGetCustomers();

  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, number>>({});
  const [selectedImageType, setSelectedImageType] = useState<
    Record<string, "apparel" | "uploaded">
  >({});
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

  const matchingCustomer = customers?.find(
    (customer) => customer?.id === order?.customer_id
  );

  if (isLoading) return <OrderDetailsSkeleton />;
  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <p className="text-lg text-base-content">Order not found</p>
      </div>
    );
  }

  const taxRate = 0.1;
  const totalAmount = parseFloat(order.total_amount || "0");
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
      completed: { bg: "bg-success", text: "text-success-content", label: "Completed" },
      pending: { bg: "bg-warning", text: "text-warning-content", label: "Pending" },
      cancelled: { bg: "bg-error", text: "text-error-content", label: "Cancelled" },
      default: { bg: "bg-primary", text: "text-primary-content", label: status },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.default;
    return (
      <span className={`badge ${config.bg} ${config.text} px-3 py-1 text-sm font-medium`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-base-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <BackButton
            name="Orders"
            className="btn btn-ghost mb-4 text-base-content hover:bg-base-300"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-base-content">Order Details</h1>
          <p className="text-sm text-base-content/70 mt-2">Order ID: {order.id}</p>
          <div className="mt-4">{getStatusBadge(order.status)}</div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side (Scrollable Product Cards) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100 pr-2"
          >
            <AnimatePresence>
              {order.line_items?.map((item, itemIndex) => {
                const isDesignable = !!item.designs && item.designs.length > 0;
                const selectedDesignIndex = selectedDesigns[item.product_id] || 0;
                const selectedDesign = isDesignable
                  ? item.designs[selectedDesignIndex]
                  : null;
                const imageType = selectedImageType[item.product_id] || "apparel";
                const hasUploadedImages =
                  isDesignable && selectedDesign?.uploadedImages?.length > 0;
                const currentUploadedImageIndex =
                  currentImageIndex[item.product_id] || 0;

                const standardImages = !isDesignable ? item.images || [] : [];
                const selectedStandardImageIndex =
                  selectedDesigns[item.product_id] || 0;
                const selectedStandardImage =
                  standardImages[selectedStandardImageIndex] ||
                  standardImages[0] ||
                  "/placeholder.svg";

                return (
                  <motion.div
                    key={item.product_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="card bg-base-100 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <h3 className="text-xl font-semibold text-base-content">
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-4 mt-2 md:mt-0">
                        <span className="text-sm text-base-content/70">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-lg font-semibold text-base-content">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Main Image Display */}
                      <div className="relative w-full md:w-[400px] h-[300px] md:h-[400px] bg-base-200 rounded-xl overflow-hidden">
                        {isDesignable && selectedDesign ? (
                          imageType === "apparel" ? (
                            <>
                              <Image
                                src={
                                  selectedDesign.apparel.url || "/placeholder.svg"
                                }
                                alt={`${selectedDesign.apparel.side} view`}
                                fill
                                sizes="(max-width: 768px) 100vw, 400px"
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
                                        selectedDesign.apparel.side === "leftshoulder"
                                          ? "35px"
                                          : selectedDesign.apparel.side === "rightshoulder"
                                          ? "30px"
                                          : "initial",
                                      left:
                                        selectedDesign.apparel.side === "leftshoulder"
                                          ? "-10px"
                                          : selectedDesign.apparel.side === "rightshoulder"
                                          ? "8px"
                                          : "initial",
                                      width: ["leftshoulder", "rightshoulder"].includes(
                                        selectedDesign.apparel.side
                                      )
                                        ? "30%"
                                        : "50%",
                                      height: ["leftshoulder", "rightshoulder"].includes(
                                        selectedDesign.apparel.side
                                      )
                                        ? "30%"
                                        : "50%",
                                    }}
                                  >
                                    <Image
                                      src={
                                        selectedDesign.pngImage || "/placeholder.svg"
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
                            selectedDesign.uploadedImages?.[currentUploadedImageIndex] && (
                              <Image
                                src={
                                  selectedDesign.uploadedImages[currentUploadedImageIndex] ||
                                  "/placeholder.svg"
                                }
                                alt={`Uploaded design ${currentUploadedImageIndex + 1}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 400px"
                                className="object-contain"
                              />
                            )
                          )
                        ) : (
                          <Image
                            src={selectedStandardImage}
                            alt={`${item.title} view`}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-top object-cover"
                          />
                        )}
                      </div>

                      {/* Thumbnails and Controls */}
                      <div className="flex flex-col justify-between w-full md:w-auto">
                        <div className="flex flex-wrap gap-2 md:flex-col md:space-y-4">
                          {isDesignable && item.designs && item.designs.length > 0 ? (
                            item.designs.map((design, index) => (
                              <button
                                key={index}
                                onClick={() => handleThumbnailClick(item.product_id, index)}
                                className={`btn btn-ghost w-20 h-20 rounded-lg overflow-hidden relative transition-all ${
                                  selectedDesignIndex === index
                                    ? "ring-2 ring-primary"
                                    : "ring-1 ring-base-300 hover:ring-primary"
                                }`}
                              >
                                <Image
                                  src={design.apparel?.url || "/placeholder.svg"}
                                  alt={`Side: ${design.apparel.side}`}
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                  style={{
                                    backgroundColor: design.apparel?.color || "#ffffff",
                                  }}
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-base-300/80 py-1">
                                  <span className="text-[10px] text-base-content text-center block">
                                    {design.apparel.side}
                                  </span>
                                </div>
                                {design.pngImage && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                      className="relative"
                                      style={{
                                        width: ["leftshoulder", "rightshoulder"].includes(
                                          design.apparel.side
                                        )
                                          ? "30%"
                                          : "50%",
                                        height: ["leftshoulder", "rightshoulder"].includes(
                                          design.apparel.side
                                        )
                                          ? "30%"
                                          : "50%",
                                      }}
                                    >
                                      <Image
                                        src={design.pngImage || "/placeholder.svg"}
                                        alt="Design preview"
                                        fill
                                        sizes="80px"
                                        className="object-contain"
                                      />
                                    </div>
                                  </div>
                                )}
                              </button>
                            ))
                          ) : standardImages.length > 0 ? (
                            standardImages.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => handleThumbnailClick(item.product_id, index)}
                                className={`btn btn-ghost w-20 h-20 rounded-lg overflow-hidden relative transition-all ${
                                  selectedStandardImageIndex === index
                                    ? "ring-2 ring-primary"
                                    : "ring-1 ring-base-300 hover:ring-primary"
                                }`}
                              >
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`View ${index + 1}`}
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                />
                              </button>
                            ))
                          ) : null}
                        </div>
                        <div className="mt-4">
                          {isDesignable && hasUploadedImages && (
                            <button
                              onClick={() => toggleImageType(item.product_id)}
                              className="btn btn-outline btn-primary w-full md:w-auto"
                            >
                              {imageType === "apparel" ? "View Uploaded" : "View on Apparel"}
                            </button>
                          )}
                          {!isDesignable && (
                            <div className="text-sm text-base-content/70 space-y-1">
                              <p>Size: {item.selected_size || "N/A"}</p>
                              <p>Color: {item.selected_color || "N/A"}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Customer Information */}
            <div className="card bg-base-100 shadow-lg rounded-xl p-6">
              <h2 className="text-xl font-bold text-base-content flex items-center gap-2 mb-4">
                <User className="w-5 h-5" /> Customer Information
              </h2>
              {matchingCustomer ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-base-content">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium">
                      {`${matchingCustomer.first_name} ${matchingCustomer.last_name}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-base-content">
                    <FiMail className="w-5 h-5 text-primary" />
                    <span>{matchingCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-base-content">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>{matchingCustomer.phone || "Not provided"}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-base-content">
                  <FiMail className="w-5 h-5 text-primary" />
                  <span>{order.email}</span>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="card bg-base-100 shadow-lg rounded-xl p-6">
              <h2 className="text-xl font-bold text-base-content flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5" /> Order Summary
              </h2>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/70">Subtotal</span>
                    <span className="font-medium text-base-content">
                      ${subtotalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/70">Tax (10%)</span>
                    <span className="font-medium text-base-content">
                      ${taxAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/70">Currency</span>
                    <span className="font-medium text-base-content">
                      {order.currency_code.toUpperCase()}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-base-300">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold text-base-content flex items-center gap-1">
                        <DollarSign className="w-5 h-5" /> Total
                      </span>
                      <span className="font-bold text-base-content">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsSkeleton = () => (
  <div className="min-h-screen p-4 md:p-6 bg-base-200">
    <div className="max-w-7xl mx-auto">
      <div className="animate-pulse space-y-8">
        <div className="text-center space-y-4">
          <div className="h-8 bg-base-300 rounded-lg w-48 mx-auto"></div>
          <div className="h-4 bg-base-300 rounded-lg w-32 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 max-h-[70vh] overflow-y-auto">
            {[1, 2].map((i) => (
              <div key={i} className="card bg-base-100 rounded-xl p-6">
                <div className="h-[300px] md:h-[400px] bg-base-300 rounded-xl mb-4"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-20 bg-base-300 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ))}
 EMA          </div>

          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="card bg-base-100 rounded-xl p-6">
                <div className="h-5 bg-base-300 rounded-lg w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-base-300 rounded-lg w-full"></div>
                  <div className="h-4 bg-base-300 rounded-lg w-5/6"></div>
                  <div className="h-4 bg-base-300 rounded-lg w-4/6"></div>
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