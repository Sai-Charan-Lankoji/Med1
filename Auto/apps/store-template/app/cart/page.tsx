"use client";
import React from "react";
import { useNewCart } from "../hooks/useNewCart";
import { useUserContext } from "@/context/userContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { ChevronLeft, ChevronRight, XMarkMini } from "@medusajs/icons";
import { ICartItem } from "@/@types/models";
import { IDesign, IProps } from "@/@types/models";
import { DesignContext } from "@/context/designcontext";
import {NEXT_PUBLIC_VENDOR_ID,NEXT_PUBLIC_STORE_ID} from "../../constants/constants"

interface OrderData {
  line_items: Array<{
    product_id: number | string | undefined;
    quantity: number;
    price: number;
    designs: any[];
  }>;
  total_amount: number;
  currency_code: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  customer_id: string | null;
  email: string | null;
  region_id: string;
  vendor_id: string | null;
  public_api_key: string | null;
  store_id : string | null;
}

const CartPage = () => {
  const { cartItems, deleteCart, updateCartQuantity, clearCart, loading } =
    useNewCart();
  const { customerToken } = useUserContext();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: createOrder, isLoading, isError } = useCreateOrder();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const designContext = React.useContext(DesignContext);
  const { designs, dispatchDesign } = designContext || {
    designs: [],
    dispatchDesign: () => {},
  };
  const [selectedDesigns, setSelectedDesigns] = useState<
    Record<string, number>
  >({});
  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});
  const [imageViewMode, setImageViewMode] = useState<
    Record<string, "apparel" | "uploaded">
  >({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleViewMode = (itemId: string) => {
    setImageViewMode((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === "apparel" ? "uploaded" : "apparel",
    }));
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    setSelectedItems((prev) => {
      // If all items are selected, unselect all
      if (prev.size === cartItems.length) {
        return new Set();
      }
      // Otherwise, select all items
      return new Set(cartItems.map((item) => item.id));
    });
  };

  const handleDeleteCart = async (cartId: string) => {
    const success = await deleteCart(cartId);
    if (success) {
      setSelectedItems((prev) => {
        const newSelected = new Set(prev);
        newSelected.delete(cartId);
        return newSelected;
      });
      closeModal();
    } else {
      setError("Failed to delete cart item");
    }
  };

  const handleClearCart = async () => {
    const success = await clearCart();
    if (success) {
      setSelectedItems(new Set());
      console.log("Cart cleared successfully");
    } else {
      setError("Failed to clear cart");
    }
  };

  const openModal = (itemId: string) => {
    setItemToRemove(itemId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setItemToRemove(null);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (itemToRemove) {
      await handleDeleteCart(itemToRemove);
    }
  };

  const handleQuantityChange = async (itemId: any, newQuantity: any) => {
    setError(null);

    if (newQuantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (newQuantity > 10) {
      setError("Maximum quantity allowed is 10");
      return;
    }

    setUpdating(true);
    try {
      const success = await updateCartQuantity(itemId, newQuantity);
      if (!success) {
        setError("Failed to update quantity");
      }
    } catch (error) {
      setError("Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const calculateSelectedTotals = () => {
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.has(item.id)
    );
    const subtotal = selectedCartItems.reduce((total, item) => {
      const numberOfSides = item.designs ? item.designs.length : 1;
      return total + 100 * numberOfSides * item.quantity;
    }, 0);

    const shippingCost = 0;
    const taxRate = 0.1;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + shippingCost + taxAmount;

    return { subtotal, shippingCost, taxAmount, total };
  };

  const handleProceedToOrder = async () => {
    if (isProcessingOrder) return;
    if (selectedItems.size === 0) {
      setError("Please select at least one item to proceed with the order");
      return;
    }

    setIsProcessingOrder(true);
    setError(null);

    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.has(item.id)
    );
    const { total } = calculateSelectedTotals();

    const orderData: OrderData = {
      line_items: selectedCartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        designs: item.designs,
      })),
      total_amount: total,
      currency_code: "usd",
      status: "pending",
      fulfillment_status: "not_fulfilled",
      payment_status: "awaiting",
      customer_id: sessionStorage.getItem("customerId"),
      email: sessionStorage.getItem("customerEmail"),
      region_id: "reg_01J2GRDEGRBXFBD4HZW443AF8K",
      vendor_id: NEXT_PUBLIC_VENDOR_ID,
      public_api_key: process.env.NEXT_PUBLIC_API_KEY || null,
      store_id : NEXT_PUBLIC_STORE_ID 
    };

    createOrder(orderData, {
      onSuccess: async () => {
    
          router.push("./order-confirmation");
          try {
            // Remove ordered items from cart
            for (const itemId of selectedItems) {
              await deleteCart(itemId);
            }
            setSelectedItems(new Set()); 
        } catch (err) {
          console.error("Error processing order:", err);
          setError("Failed to complete order process.");
          setIsProcessingOrder(false);
        }
      },
      onError: (err) => {
        console.error("Error placing order:", err);
        setError("Failed to place order. Please try again.");
        setIsProcessingOrder(false);
      },
    });
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

  const handleDesignClick = async (
    designState: IDesign,
    propsState: IProps,
    id: any
  ) => {
    localStorage.setItem("savedDesignState", JSON.stringify(designState));
    localStorage.setItem("savedPropsState", JSON.stringify(propsState));
    localStorage.setItem("cart_id", id);
    dispatchDesign({ type: "SWITCH_DESIGN", currentDesign: designState });

    await new Promise((resolve) => setTimeout(resolve, 100));
    router.push("/dashboard");

    const canvasElement = document.querySelector(".canvas-container");
    if (canvasElement) {
      canvasElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleThumbnailClick = (itemId: string, designIndex: number) => {
    setSelectedDesigns((prev) => ({
      ...prev,
      [itemId]: designIndex,
    }));
  };

  const isAllSelected =
    cartItems.length > 0 && selectedItems.size === cartItems.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sign in banner */}
      {!customerToken && (
        <div className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-lg font-semibold">
                  Already have an account?
                </h2>
                <p className="text-blue-100">
                  Sign in for a better experience.
                </p>
              </div>
              <Link href="/auth">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition duration-200 font-medium">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main cart section */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Shopping Cart
                </h1>
                {cartItems.length > 0 && (
               <div className="flex justify-between space-x-4">
               <button
                 onClick={handleSelectAll}
                 className="px-4 py-2 text-sm font-medium text-gray-600 bg-blue-100 rounded hover:bg-blue-200 hover:text-gray-800 transition-colors"
               >
                 {isAllSelected ? "Unselect All" : "Select All"}
               </button>
               
               <button
                 onClick={handleClearCart}
                 className={`px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                 disabled={loading}
               >
                 {loading ? "Clearing..." : "Clear Cart"}
               </button>
             </div>
             
              
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                    {/* Cart icon SVG can go here */}
                  </div>
                  <h2 className="text-xl font-medium mb-4 text-gray-900">
                    Your cart is empty
                  </h2>
                  <p className="text-gray-500 mb-8">
                    Looks like you haven&apost added any items to your cart yet.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-200"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 ">
                  {cartItems.map((item) => {
                    if (!item.designs?.length) return null;

                    const pricePerItem = item.designs
                      ? item.designs.length * 100
                      : 100;
                    const itemTotal = pricePerItem * item.quantity;
                    const mainDesignIndex = selectedDesigns[item.id] || 0;
                    const currentDesign = item.designs[mainDesignIndex];
                    const currentUploadedImageIndex =
                      currentImageIndex[item.id] || 0;
                    const viewMode = imageViewMode[item.id] || "apparel";
                    const hasUploadedImages =
                      currentDesign?.uploadedImages &&
                      currentDesign.uploadedImages?.[0]?.length > 0;

                    return (
                      <div key={item.id} className="p-6 ">
                        <div className="flex items-start space-x-4">
                          {/* Checkbox */}
                          <div className="pt-2">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => handleItemSelect(item.id)}
                              className="w-4 h-4 text-blue-600 rounded border-gray-500 focus:ring-blue-500 "
                            />
                          </div>

                          <div className="flex flex-col md:flex-row gap-4  flex-1">
                            {/* Product image and thumbnails */}
                            <div className="md:w-1/2">
                              <div
                                className="relative w-48 h-56 rounded-lg overflow-hidden bg-gray-100"
                                onClick={() =>
                                  handleDesignClick(
                                    item.designState,
                                    item.propsState,
                                    item.id
                                  )
                                }
                              >
                                {viewMode === "apparel" ? (
                                  <>
                                    <div className="absolute inset-0">
                                      <Image
                                        src={currentDesign.apparel.url}
                                        alt={`Side: ${currentDesign.apparel.side}`}
                                        fill
                                        sizes="100%"
                                        priority
                                        className="rounded-none"
                                        style={{
                                          backgroundColor:
                                            currentDesign.apparel?.color,
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div
                                        className="relative translate-y-[-10%]"
                                        style={{
                                          top:
                                            currentDesign.apparel.side ===
                                            "leftshoulder"
                                              ? "35px"
                                              : currentDesign.apparel.side ===
                                                "rightshoulder"
                                              ? "30px"
                                              : "initial",
                                          left:
                                            currentDesign.apparel.side ===
                                            "leftshoulder"
                                              ? "-10px"
                                              : currentDesign.apparel.side ===
                                                "rightshoulder"
                                              ? "8px"
                                              : "initial",
                                          width:
                                            currentDesign.apparel.side ===
                                              "leftshoulder" ||
                                            currentDesign.apparel.side ===
                                              "rightshoulder"
                                              ? "30%"
                                              : "50%",
                                          height:
                                            currentDesign.apparel.side ===
                                              "leftshoulder" ||
                                            currentDesign.apparel.side ===
                                              "rightshoulder"
                                              ? "30%"
                                              : "50%",
                                        }}
                                      >
                                        <Image
                                          src={currentDesign.pngImage}
                                          alt="Design"
                                          fill
                                          sizes="100%"
                                          className="rounded-md"
                                          style={{ objectFit: "contain" }}
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  hasUploadedImages &&
                                  currentDesign?.uploadedImages?.[
                                    currentUploadedImageIndex
                                  ] && (
                                    <Image
                                      src={
                                        currentDesign.uploadedImages[
                                          currentUploadedImageIndex
                                        ]
                                      }
                                      alt={`Uploaded image`}
                                      fill
                                      sizes="100%"
                                      className="object-contain"
                                    />
                                  )
                                )}
                              </div>

                              {/* Thumbnails */}
                              <div className="mt-4 grid grid-cols-4 gap-6">
                                {viewMode === "apparel"
                                  ? item.designs.map((design, index) => (
                                      <div
                                        key={index}
                                        className={`relative w-16 h-20 cursor-pointer transition-all duration-200 ${
                                          index === mainDesignIndex
                                            ? "ring-2 ring-gray-700"
                                            : "hover:ring-2 hover:ring-gray-300"
                                        }`}
                                        onClick={() =>
                                          handleThumbnailClick(item.id, index)
                                        }
                                      >
                                        <div className="absolute inset-0">
                                          <Image
                                            src={design.apparel?.url}
                                            alt={`Side: ${design.apparel.side}`}
                                            fill
                                            sizes="100%"
                                            priority
                                            className="rounded-none"
                                            style={{
                                              backgroundColor:
                                                design.apparel?.color,
                                              objectFit: "cover",
                                            }}
                                          />
                                        </div>
                                        <div className="absolute inset-0 flex items-center  justify-center">
                                          <div
                                            className="relative translate-y-[-10%]"
                                            style={{
                                              top:
                                                design.apparel.side ===
                                                "leftshoulder"
                                                  ? "12px"
                                                  : design.apparel.side ===
                                                    "rightshoulder"
                                                  ? "12px"
                                                  : "initial",
                                              left:
                                                design.apparel.side ===
                                                "leftshoulder"
                                                  ? "-3px"
                                                  : design.apparel.side ===
                                                    "rightshoulder"
                                                  ? "2px"
                                                  : "initial",
                                              width:
                                                design.apparel.side ===
                                                  "leftshoulder" ||
                                                design.apparel.side ===
                                                  "rightshoulder"
                                                  ? "30%"
                                                  : "50%",
                                              height:
                                                design.apparel.side ===
                                                  "leftshoulder" ||
                                                design.apparel.side ===
                                                  "rightshoulder"
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
                                      </div>
                                    ))
                                  : currentDesign?.uploadedImages?.map(
                                      (image, index) => (
                                        <button
                                          key={index}
                                          className={`aspect-square relative rounded-md overflow-hidden ${
                                            index === currentUploadedImageIndex
                                              ? "ring-2 ring-black"
                                              : "ring-1 ring-gray-200 hover:ring-gray-300"
                                          }`}
                                          onClick={() =>
                                            setCurrentImageIndex((prev) => ({
                                              ...prev,
                                              [item.id]: index,
                                            }))
                                          }
                                        >
                                          <Image
                                            src={image}
                                            alt={`Upload ${index + 1}`}
                                            fill
                                            sizes="100%"
                                            className="object-cover"
                                          />
                                        </button>
                                      )
                                    )}
                              </div>
                            </div>

                            {/* Product details */}
                            <div className="md:w-1/2 flex flex-col">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">
                                    Designed Sides:{" "}
                                    {getDesignedSidesText(item.designs)}
                                  </p>
                                  {hasUploadedImages && (
                                    <button
                                      onClick={() => toggleViewMode(item.id)}
                                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                      {viewMode === "apparel"
                                        ? "View Uploaded Images"
                                        : "View Design Preview"}
                                    </button>
                                  )}
                                </div>
                                <button
                                  onClick={() => openModal(item.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                  title="Remove item"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="mt-auto pt-6">
                                <div className="flex justify-between items-center mb-4">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      className="w-8 h-8 rounded-full text-black bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity - 1
                                        )
                                      }
                                      disabled={updating || item.quantity <= 1}
                                    >
                                      -
                                    </button>
                                    <span className="w-8 text-center text-black font-medium">
                                      {item.quantity}
                                    </span>
                                    <button
                                      className="w-8 h-8 rounded-full text-black bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity + 1
                                        )
                                      }
                                      disabled={updating || item.quantity >= 10}
                                    >
                                      +
                                    </button>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-500">
                                      Price per item
                                    </div>
                                    <div className="font-medium text-black">
                                      ${pricePerItem.toFixed(2)}
                                    </div>
                                  </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-black">
                                      Subtotal
                                    </span>
                                    <span className="font-medium text-black">
                                      ${itemTotal.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary - Now positioned on the right */}
          {cartItems.length > 0 && (
            <div className="lg:w-[380px] flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-8">
                <h2 className="text-xl text-black font-bold mb-6">
                  Order Summary
                </h2>

                {selectedItems.size > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Selected Items</span>
                      <span className="font-medium text-black">
                        {selectedItems.size}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-black">
                        ${calculateSelectedTotals().subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (10%)</span>
                      <span className="font-medium text-black">
                        ${calculateSelectedTotals().taxAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-black text-lg font-bold">
                          Total
                        </span>
                        <span className="text-black text-lg font-bold">
                          ${calculateSelectedTotals().total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    Please select items to proceed with order
                  </p>
                )}

                <button
                  className="w-full mt-6 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleProceedToOrder}
                  disabled={
                    isLoading || selectedItems.size === 0 || !customerToken
                  }
                >
                  {isLoading
                    ? "Processing..."
                    : !customerToken
                    ? "Login to proceed order"
                    : selectedItems.size === 0
                    ? "Select items to order"
                    : "Confirm Order"}
                </button>

                {error && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {error}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for deleting items */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkMini className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
