"use client";

//import { useCart } from "@/context/cartContext";
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
}

const CartPage = () => {
  //const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { cartItems, deleteCart, updateCartQuantity, clearCart } = useNewCart();
  const { customerToken } = useUserContext();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: createOrder, isLoading, isError } = useCreateOrder();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [selectedDesigns, setSelectedDesigns] = useState<
    Record<string, number>
  >({});
  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});
  const [imageViewMode, setImageViewMode] = useState<
    Record<string, "apparel" | "uploaded">
  >({});

  const toggleViewMode = (itemId: string) => {
    setImageViewMode((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === "apparel" ? "uploaded" : "apparel",
    }));
  };

  const nextImage = (itemId: string, maxLength: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] + 1) % maxLength,
    }));
  };

  const prevImage = (itemId: string, maxLength: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === 0 ? maxLength - 1 : prev[itemId] - 1,
    }));
  };

  const handleDeleteCart = async (cartId: string) => {
    const success = await deleteCart(cartId);
    if (success) {
      // Only clear local cart state after successful API call

      closeModal();
    } else {
      setError("Failed to delete cart item");
    }
  };

  const handleClearCart = async () => {
    const success = await clearCart();
    if (success) {
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

  const shippingCost: number = 0;
  const taxRate: number = 0.1;

  // Updated subtotal calculation to account for $100 per side
  const subtotal: number = cartItems.reduce((total, item) => {
    const numberOfSides = item.designs ? item.designs.length : 1;
    return total + 100 * numberOfSides * item.quantity; // $100 per side
  }, 0);

  const taxAmount: number = subtotal * taxRate;
  const total: number = subtotal + shippingCost + taxAmount;

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
      // Call the updateCartQuantity function from useNewCart hook
      const success = await updateCartQuantity(itemId, newQuantity);

      if (success) {
        // The cart state will be automatically updated through Redux
        // since updateCartQuantity dispatches fetchCartSuccess
      } else {
        setError("Failed to update quantity");
      }
    } catch (error) {
      setError("Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const public_api_key = process.env.NEXT_PUBLIC_API_KEY || null;
  const vendorId = process.env.NEXT_PUBLIC_VENDOR_ID || null;

  const handleProceedToOrder = () => {
    if (isProcessingOrder) return;
    setIsProcessingOrder(true);

    const orderData: OrderData = {
      line_items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price, // Updated price calculation
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
      vendor_id: vendorId,
      public_api_key: public_api_key,
    };

    createOrder(orderData, {
      onSuccess: async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 100));

          router.push("./order-confirmation");
          await handleClearCart();
        } catch (err) {
          console.error("Navigation error:", err);
          setError("Failed to navigate to order confirmation page.");
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

  const handleThumbnailClick = (itemId: string, designIndex: number) => {
    setSelectedDesigns((prev) => ({
      ...prev,
      [itemId]: designIndex,
    }));
  };
  console.log("cart..", cartItems);
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 text-black">
      {!customerToken && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Already have an account?
              </h2>
              <p className="text-gray-600">Sign in for a better experience.</p>
            </div>
            <Link href="/auth">
              <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-200">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <Link
                href="/"
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4">Product</th>
                    <th className="text-left py-4">Quantity</th>
                    <th className="text-left py-4">Price</th>
                    <th className="text-left py-4">Total</th>
                    <th className="text-left py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item: ICartItem) => {
                    // Early return if designs array is empty or undefined
                    if (!item.designs?.length) {
                      return null;
                    }

                    const pricePerItem = item.designs
                      ? item.designs.length * 100
                      : 100;
                    const itemTotal = pricePerItem * item.quantity;
                    const mainDesignIndex = selectedDesigns[item.id] || 0;
                    const currentUploadedImageIndex =
                      currentImageIndex[item.id] || 0;
                    const viewMode = imageViewMode[item.id] || "apparel";
                    const currentDesign = item.designs[mainDesignIndex];
                    const hasUploadedImages = currentDesign?.uploadedImages[0]?.length > 0;

                    return (
                      <tr key={item.id} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="mt-2">
                              <div className="flex flex-row justify-between items-stretch mb-2">
                                <div>
                                <p className="text-sm text-gray-600">
                                  Designed Sides:{" "}
                                  {getDesignedSidesText(item.designs)}
                                </p>
                                </div>
                                <div>
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
                              </div>
                              <div className="flex gap-4">
                                {/* Main display area */}
                                <div className="relative w-48 h-56">
                                  {viewMode === "apparel" ? (
                                    <>
                                      <div className="absolute inset-0">
                                        {currentDesign?.apparel?.url && (
                                          <Image
                                            src={currentDesign.apparel.url}
                                            alt={`Side: ${currentDesign.apparel.side}`}
                                            fill
                                            sizes="100%"
                                            priority
                                            className="rounded-none"
                                            style={{
                                              backgroundColor:
                                                currentDesign.apparel.color,
                                              objectFit: "cover",
                                            }}
                                          />
                                        )}
                                      </div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                          className="relative translate-y-[-10%]"
                                          style={{
                                            top:
                                              currentDesign?.apparel?.side ===
                                              "leftshoulder"
                                                ? "35px"
                                                : currentDesign?.apparel
                                                    ?.side === "rightshoulder"
                                                ? "30px"
                                                : "initial",
                                            left:
                                              currentDesign?.apparel?.side ===
                                              "leftshoulder"
                                                ? "-10px"
                                                : currentDesign?.apparel
                                                    ?.side === "rightshoulder"
                                                ? "8px"
                                                : "initial",
                                            width:
                                              currentDesign?.apparel?.side ===
                                                "leftshoulder" ||
                                              currentDesign?.apparel?.side ===
                                                "rightshoulder"
                                                ? "30%"
                                                : "50%",
                                            height:
                                              currentDesign?.apparel?.side ===
                                                "leftshoulder" ||
                                              currentDesign?.apparel?.side ===
                                                "rightshoulder"
                                                ? "30%"
                                                : "50%",
                                          }}
                                        >
                                          {currentDesign?.pngImage && (
                                            <Image
                                              src={currentDesign.pngImage}
                                              alt="Main design"
                                              fill
                                              sizes="100%"
                                              className="rounded-md"
                                              style={{ objectFit: "contain" }}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    hasUploadedImages &&
                                    currentDesign?.uploadedImages && currentDesign.uploadedImages.length > 0 && (
                                      <div className="relative w-full h-full">
                                        <Image
                                          src={currentDesign.uploadedImages[currentUploadedImageIndex]}
                                          alt={`Uploaded image ${currentUploadedImageIndex + 1}`}
                                          fill
                                          sizes="100%"
                                          className="rounded-lg"
                                          style={{ objectFit: "contain" }}
                                        />
                                        {currentDesign.uploadedImages.length > 1 && (
                                          <>
                                            <button
                                              onClick={() =>
                                                prevImage(
                                                  item.id,
                                                  currentDesign.uploadedImages.length
                                                )
                                              }
                                              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
                                            >
                                              <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() =>
                                                nextImage(
                                                  item.id,
                                                  currentDesign.uploadedImages.length
                                                )
                                              }
                                              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
                                            >
                                              <ChevronRight className="w-4 h-4" />
                                            </button>
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                                              {currentUploadedImageIndex + 1} / {currentDesign.uploadedImages.length}
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>

                                {/* Thumbnails */}
                                <div className="flex flex-col gap-2">
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
                                          {design.apparel?.url && (
                                            <div className="absolute inset-0">
                                              <Image
                                                src={design.apparel.url}
                                                alt={`Side: ${design.apparel.side}`}
                                                priority
                                                fill
                                                sizes="100%"
                                                className="rounded-none"
                                                style={{
                                                  backgroundColor:
                                                    design.apparel.color,
                                                  objectFit: "cover",
                                                }}
                                              />
                                            </div>
                                          )}
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative w-1/2 h-1/2 translate-y-[-10%]">
                                              {design.pngImage && (
                                                <Image
                                                  src={design.pngImage}
                                                  alt={`Thumbnail ${index + 1}`}
                                                  fill
                                                  sizes="100%"
                                                  className="rounded-md"
                                                  style={{
                                                    objectFit: "contain",
                                                  }}
                                                />
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    : hasUploadedImages &&
                                      currentDesign?.uploadedImages?.map(
                                        (image, index) => (
                                          <div
                                            key={index}
                                            className={`relative w-16 h-20 cursor-pointer transition-all duration-200 ${
                                              index ===
                                              currentUploadedImageIndex
                                                ? "ring-2 ring-gray-700"
                                                : "hover:ring-2 hover:ring-gray-300"
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
                                              alt={`Uploaded thumbnail ${
                                                index + 1
                                              }`}
                                              fill
                                              sizes="100%"
                                              className="rounded-lg"
                                              style={{ objectFit: "cover" }}
                                            />
                                          </div>
                                        )
                                      )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={updating || item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              disabled={updating || item.quantity >= 10}
                            >
                              +
                            </button>
                          </div>
                          {error && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                          )}
                        </td>
                        <td className="py-4 px-auto">
                          ${pricePerItem.toFixed(2)}
                        </td>
                        <td className="py-4 px-auto">
                          ${itemTotal.toFixed(2)}
                        </td>
                        <td className="py-4 px-auto">
                          <button
                            onClick={() => openModal(item.id)}
                            className="text-red-500 hover:text-red-700 transition duration-200"
                            title="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? "Free"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full mt-6 bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition duration-200 disabled:bg-gray-400"
                onClick={handleProceedToOrder}
                disabled={isLoading}
              >
                {isLoading && customerToken
                  ? "Processing..."
                  : customerToken
                  ? "Confirm Order"
                  : "Login to proceed order"}
              </button>
              {isError && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-800 transition duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 h-auto max-w-md w-full mx-4">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl font-semibold">Please confirm</h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <XMarkMini className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="h-px bg-gray-200 my-4" />

            <p className="text-gray-700 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>

            <div className="flex flex-row gap-3 justify-end">
              <button
                className="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-600 transition-colors font-medium text-sm"
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
