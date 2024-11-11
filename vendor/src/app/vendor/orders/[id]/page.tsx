"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetOrder } from "@/app/hooks/orders/useGetOrder";
import { BackButton } from "@/app/utils/backButton";
import {
  FiPackage,
  FiCreditCard,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { useGetCustomers } from "@/app/hooks/customer/useGetCustomers";
import { ChevronLeft, ChevronRight } from "@medusajs/icons";

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
    setSelectedImageType(prev => ({
      ...prev,
      [productId]: prev[productId] === "apparel" ? "uploaded" : "apparel"
    }));
  };

  const nextImage = (productId, maxLength) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] + 1) % maxLength
    }));
  };

  const prevImage = (productId, maxLength) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: prev[productId] === 0 ? maxLength - 1 : prev[productId] - 1
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
          const hasUploadedImages = selectedDesign.uploadedImages?.length > 0;
          const currentUploadedImageIndex = currentImageIndex[item.product_id] || 0;

          return (
            <div key={item.product_id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4">
                Item {itemIndex + 1}
              </h3>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Main Design Display */}
                <div className="relative w-full md:w-96 h-96 bg-gray-50 rounded-lg">
                  {imageType === "apparel" ? (
                    <>
                      <Image
                        src={selectedDesign.apparel.url}
                        alt={`${selectedDesign.apparel.side} view`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                        style={{
                          backgroundColor: selectedDesign.apparel?.color,
                        }}
                       />
                      {selectedDesign.pngImage && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-1/2 h-1/2">
                            <Image
                              src={selectedDesign.pngImage}
                              alt="Design overlay"
                              layout="fill"
                              objectFit="contain"
                             />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    hasUploadedImages && (
                      <div className="relative w-full h-full">
                        <Image
                          src={selectedDesign.uploadedImages[currentUploadedImageIndex]}
                          alt={`Uploaded design ${currentUploadedImageIndex + 1}`}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-lg"
                         />
                        
                        {/* Navigation arrows */}
                        {selectedDesign.uploadedImages.length > 1 && (
                          <>
                            {/* <button
                              onClick={() => prevImage(item.product_id, selectedDesign.uploadedImages.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => nextImage(item.product_id, selectedDesign.uploadedImages.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button> */}
                            
                            {/* Image counter
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                              {currentUploadedImageIndex + 1} / {selectedDesign.uploadedImages.length}
                            </div> */}
                          </>
                        )}
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
                        onClick={() => handleThumbnailClick(item.product_id, index)}
                        className={`relative w-20 h-20 rounded-lg transition-all ${
                          selectedDesignIndex === index
                            ? "ring-2 ring-blue-500"
                            : "hover:ring-2 hover:ring-gray-300"
                        }`}
                      >
                        <Image
                          src={design.apparel.url}
                          alt={`${design.apparel.side} thumbnail`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                          style={{
                            backgroundColor: design.apparel?.color,
                          }}
                         />
                        <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center rounded-b-lg">
                          {design.apparel.side}
                        </span>
                        {design.uploadedImages?.length > 0 && (
                          <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full" />
                        )}
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
                          {selectedDesign.uploadedImages.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(prev => ({
                                ...prev,
                                [item.product_id]: index
                              }))}
                              className={`relative w-16 h-16 rounded-lg transition-all ${
                                currentUploadedImageIndex === index
                                  ? "ring-2 ring-blue-500"
                                  : "hover:ring-2 hover:ring-gray-300"
                              }`}
                            >
                              <Image
                                src={image}
                                alt={`Uploaded design thumbnail ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                               />
                            </button>
                          ))}
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
      <div className="space-y-6">
        {/* ... Order Summary Sidebar ... */}
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
