"use client";
import React, { useEffect, useState } from "react";
import { useNewCart } from "../hooks/useNewCart";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { XMarkMini } from "@medusajs/icons";
import {
  ICartItem,
  IDesignableCartItem,
  IStandardCartItem,
  IDesign,
  IProps,
} from "@/@types/models";
import { useStore } from "@/context/storecontext";
import { DesignContext } from "@/context/designcontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { cn } from "@/app/lib/utils";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  customer_id: string;
  customer_email: string;
}

interface OrderData {
  line_items: Array<{
    product_id: string | undefined;
    quantity: number;
    price: number;
    title: string;
    images: string[];
    designs?: IDesignableCartItem["designs"];
    selected_size?: IStandardCartItem["selected_size"];
    selected_color?: IStandardCartItem["selected_color"];
    selected_variant?: IStandardCartItem["selected_variant"];
    product_type?: "designable" | "standard";
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
  store_id: string | null;
  shipping_address?: Address;
}

const BASE_URL = "http://localhost:5000";

const CartPage = () => {
  const {
    cartItems: designableCartItems,
    deleteCartItem,
    updateCartQuantity,
    fetchCartData,
    loading,
    getStandardCartItems,
  } = useNewCart();
  const { customerToken } = useUserContext();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: createOrder, isLoading: isOrderLoading } = useCreateOrder();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const { store } = useStore();

  // Address State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addressError, setAddressError] = useState<string | null>(null);

  const designContext = React.useContext(DesignContext);
  const { designs: contextDesigns, dispatchDesign } = designContext || {
    designs: [],
    dispatchDesign: () => {},
  };
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, number>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [imageViewMode, setImageViewMode] = useState<
    Record<string, "apparel" | "uploaded">
  >({});

  const allCartItems: ICartItem[] = [...designableCartItems, ...getStandardCartItems()];

  useEffect(() => {
    if (customerToken && !isCartLoaded && !loading) {
      fetchCartData().then(() => setIsCartLoaded(true));
    }
  }, [customerToken, fetchCartData, isCartLoaded, loading]);

  useEffect(() => {
    if (customerToken) {
      fetchAddresses();
    }
  }, [customerToken]);

  const fetchAddresses = async () => {
    const id = sessionStorage.getItem("customerId");
    if (!id) return;

    try {
      const response = await fetch(`${BASE_URL}/api/address/${id}`, {
        headers: {
          Authorization: `Bearer ${customerToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch addresses");
      const { data } = await response.json();
      setAddresses(data);
      if (data.length > 0) setSelectedAddressId(data[0].id);
    } catch (err) {
      setError("Failed to load addresses");
      toast.error("Failed to load addresses");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const customerId = sessionStorage.getItem("customerId");
    const customerEmail = sessionStorage.getItem("customerEmail");

    if (!customerId || !customerEmail) {
      setAddressError("Customer ID or Email not found. Please log in again.");
      return;
    }

    const addressData = {
      ...newAddress,
      customer_id: customerId,
      customer_email: customerEmail,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/address/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify(addressData),
      });
      if (!response.ok) throw new Error("Failed to add address");
      const savedAddress = await response.json();
      setAddresses([...addresses, savedAddress]);
      setSelectedAddressId(savedAddress.id);
      setNewAddress({ street: "", city: "", state: "", pincode: "" });
      setIsAddingAddress(false);
      toast.success("Address added successfully");
    } catch (err) {
      setAddressError("Failed to add address");
      toast.error("Failed to add address");
    }
  };

  const toggleViewMode = (itemId: string) => {
    setImageViewMode((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === "apparel" ? "uploaded" : "apparel",
    }));
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(itemId)) newSelected.delete(itemId);
      else newSelected.add(itemId);
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    setSelectedItems((prev) =>
      prev.size === allCartItems.length
        ? new Set()
        : new Set(allCartItems.map((item) => item.id))
    );
  };

  const handleDeleteCartItem = async (cartId: string) => {
    setError(null);
    const success = await deleteCartItem(cartId);
    if (success) {
      setSelectedItems((prev) => {
        const newSelected = new Set(prev);
        newSelected.delete(cartId);
        return newSelected;
      });
      closeModal();
      toast.success("Item removed from cart");
    } else {
      setError("Failed to delete cart item");
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    setError(null);
    try {
      const deletePromises = allCartItems.map((item) => deleteCartItem(item.id));
      await Promise.all(deletePromises);
      setSelectedItems(new Set());
      setIsCartLoaded(false);
      toast.success("Cart cleared successfully");
    } catch (err) {
      setError("Failed to clear cart");
      toast.error("Failed to clear cart");
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
    if (itemToRemove) await handleDeleteCartItem(itemToRemove);
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
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
        toast.error("Failed to update quantity");
      } else {
        toast.success("Quantity updated");
      }
    } catch (error) {
      setError("Failed to update quantity");
      toast.error("Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const calculateSelectedTotals = () => {
    const selectedCartItems = allCartItems.filter((item) =>
      selectedItems.has(item.id)
    );
    const subtotal = selectedCartItems.reduce((total, item) => {
      const pricePerItem =
        item.product_type === "designable" && item.designs?.length
          ? item.designs.length * 100
          : item.price || 100;
      return total + pricePerItem * item.quantity;
    }, 0);
    const shippingCost = 0;
    const taxRate = 0.1;
    const taxAmount = subtotal * taxRate;
    const total = subtotal + shippingCost + taxAmount;
    return { subtotal, shippingCost, taxAmount, total };
  };

  const getStandardProductSides = (productDetails: any) => {
    const sides = [];
    if (productDetails?.front_image) sides.push({ side: "front", url: productDetails.front_image });
    if (productDetails?.back_image) sides.push({ side: "back", url: productDetails.back_image });
    if (productDetails?.left_image) sides.push({ side: "left", url: productDetails.left_image });
    if (productDetails?.right_image) sides.push({ side: "right", url: productDetails.right_image });
    return sides;
  };

  const handleProceedToOrder = async () => {
    if (isProcessingOrder || selectedItems.size === 0 || !selectedAddressId) {
      setError(
        selectedItems.size === 0
          ? "Please select at least one item"
          : !selectedAddressId
          ? "Please select an address"
          : null
      );
      toast.error(
        selectedItems.size === 0
          ? "Please select at least one item"
          : !selectedAddressId
          ? "Please select an address"
          : "Order already processing"
      );
      return;
    }

    setIsProcessingOrder(true);
    setError(null);

    const customerId = sessionStorage.getItem("customerId");
    const customerEmail = sessionStorage.getItem("customerEmail");
    const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);

    if (!customerId || !customerEmail || !selectedAddress) {
      setError("Missing customer or address details. Please try again.");
      setIsProcessingOrder(false);
      toast.error("Order failed");
      return;
    }

    const selectedCartItems = allCartItems.filter((item) =>
      selectedItems.has(item.id)
    );
    const { total } = calculateSelectedTotals();

    const orderData: OrderData = {
      line_items: selectedCartItems.map((item) => {
        const isDesignable = item.product_type === "designable";
        const designItem = item as IDesignableCartItem;
        const standardItem = item as IStandardCartItem;
        const title = isDesignable
          ? "Custom Designed Product"
          : standardItem.product_details?.title || "Standard Product";
        const images = isDesignable
          ? (designItem.designs || []).map((design) => design.pngImage || design.apparel?.url || "").filter(Boolean)
          : getStandardProductSides(standardItem.product_details).map((side) => side.url).filter(Boolean);

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price:
            item.price ||
            (isDesignable && designItem.designs?.length
              ? designItem.designs.length * 100
              : 100),
          title,
          images: images.length > 0 ? images : ["/placeholder.svg"],
          designs: isDesignable ? designItem.designs : undefined,
          selected_size: !isDesignable ? standardItem.selected_size : undefined,
          selected_color: !isDesignable ? standardItem.selected_color : undefined,
          selected_variant: !isDesignable ? standardItem.selected_variant : undefined,
          product_type: item.product_type,
        };
      }),
      total_amount: total,
      currency_code: "usd",
      status: "pending",
      fulfillment_status: "not_fulfilled",
      payment_status: "awaiting",
      customer_id: customerId,
      email: customerEmail,
      region_id: "reg_01J2GRDEGRBXFBD4HZW443AF8K",
      vendor_id: store?.vendor_id,
      public_api_key: process.env.NEXT_PUBLIC_API_KEY || null,
      store_id: store?.id,
      shipping_address: selectedAddress,
    };

    console.log("Order Data Payload:", JSON.stringify(orderData, null, 2));

    createOrder(orderData, {
      onSuccess: async () => {
        try {
          for (const itemId of selectedItems) {
            await deleteCartItem(itemId);
          }
          setSelectedItems(new Set());
          setIsCartLoaded(false);
          router.push("./order-confirmation");
          toast.success("Order placed successfully");
        } catch (err) {
          setError("Failed to clear ordered items from cart");
          toast.error("Order placed but failed to clear cart");
          console.error("Error clearing cart:", err);
        } finally {
          setIsProcessingOrder(false);
        }
      },
      onError: (err: any) => {
        setIsProcessingOrder(false);
        const errorMessage = err.message || "Failed to place order. Please try again.";
        if (errorMessage.includes("Insufficient stock")) {
          toast.error(errorMessage);
        } else if (errorMessage.includes("Variant not found")) {
          toast.error("One or more items are no longer available");
        } else {
          toast.error(errorMessage);
        }
        console.error("Error placing order:", err);
      },
    });
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getDesignedSidesText = (designs?: IDesignableCartItem["designs"]) => {
    if (!designs || designs.length === 0) return "N/A";
    const sides = designs.map((design) => capitalizeFirstLetter(design.apparel.side));
    if (sides.length === 1) return sides[0];
    if (sides.length === 2) return `${sides[0]} & ${sides[1]}`;
    const lastSide = sides.pop();
    return `${sides.join(", ")} & ${lastSide}`;
  };

  const handleDesignClick = async (item: ICartItem) => {
    if (item.product_type === "standard") {
      toast.info("This item is not editable");
      return;
    }
    const designItem = item as IDesignableCartItem;
    const designState = designItem.designState;
    const propsState = designItem.propsState;
    const id = item.id;

    localStorage.setItem("savedDesignState", JSON.stringify(designState));
    localStorage.setItem("savedPropsState", JSON.stringify(propsState));
    localStorage.setItem("cart_id", id);
    if (designState) {
      dispatchDesign({ type: "SWITCH_DESIGN", currentDesign: designState[0] });
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
    router.push("/dashboard");
    const canvasElement = document.querySelector(".canvas-container");
    if (canvasElement) canvasElement.scrollIntoView({ behavior: "smooth" });
  };

  const handleThumbnailClick = (itemId: string, designIndex: number) => {
    setSelectedDesigns((prev) => ({ ...prev, [itemId]: designIndex }));
  };

  const isAllSelected = allCartItems.length > 0 && selectedItems.size === allCartItems.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {!customerToken && (
        <div className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-lg font-semibold">Already have an account?</h2>
                <p className="text-blue-100">Sign in for a better experience.</p>
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
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
                {allCartItems.length > 0 && (
                  <div className="flex justify-between space-x-4">
                    <button
                      onClick={handleSelectAll}
                      className="px-4 py-2 text-sm font-medium text-gray-600 bg-blue-100 rounded hover:bg-blue-200 hover:text-gray-800 transition-colors"
                      disabled={loading}
                    >
                      {isAllSelected ? "Unselect All" : "Select All"}
                    </button>
                    <button
                      onClick={handleClearCart}
                      className={`px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700 transition-colors ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Clearing..." : "Clear Cart"}
                    </button>
                  </div>
                )}
              </div>

              {allCartItems.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-medium mb-4 text-gray-900">Your cart is empty</h2>
                  <p className="text-gray-500 mb-8">Looks like you haven’t added any items yet.</p>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-200"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {allCartItems.map((item) => {
                    const isDesignable = item.product_type === "designable";
                    const designItem = item as IDesignableCartItem;
                    const standardItem = item as IStandardCartItem;
                    const pricePerItem = isDesignable
                      ? (designItem.designs?.length || 0) * 100
                      : standardItem.price || 100;
                    const itemTotal = pricePerItem * item.quantity;
                    const mainDesignIndex = selectedDesigns[item.id] || 0;
                    const currentDesign = isDesignable ? designItem.designs?.[mainDesignIndex] : null;
                    const currentUploadedImageIndex = currentImageIndex[item.id] || 0;
                    const viewMode = imageViewMode[item.id] || "apparel";
                    const hasUploadedImages =
                      isDesignable &&
                      currentDesign?.uploadedImages?.some((img) => img?.length > 0);
                    const standardSides = !isDesignable
                      ? getStandardProductSides(standardItem.product_details)
                      : [];
                    const currentStandardSide = !isDesignable
                      ? standardSides[mainDesignIndex] || standardSides[0]
                      : null;

                    return (
                      <div key={item.id} className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="pt-2">
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => handleItemSelect(item.id)}
                              className="w-4 h-4 text-blue-600 rounded border-gray-500 focus:ring-blue-500"
                              disabled={loading}
                            />
                          </div>
                          <div className="flex flex-col md:flex-row gap-4 flex-1">
                            <div className="md:w-1/2">
                              <div
                                className="relative w-48 h-56 rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                                onClick={() => handleDesignClick(item)}
                              >
                                {isDesignable && currentDesign ? (
                                  viewMode === "apparel" ? (
                                    <>
                                      <div className="absolute inset-0">
                                        <Image
                                          src={currentDesign.apparel.url || "/placeholder.svg"}
                                          alt={`Side: ${currentDesign.apparel.side}`}
                                          fill
                                          sizes="100%"
                                          priority
                                          className="rounded-none"
                                          style={{
                                            backgroundColor: currentDesign.apparel?.color || "#ffffff",
                                            objectFit: "cover",
                                          }}
                                        />
                                      </div>
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                          className="relative translate-y-[-10%]"
                                          style={{
                                            top:
                                              currentDesign.apparel.side === "leftshoulder"
                                                ? "35px"
                                                : currentDesign.apparel.side === "rightshoulder"
                                                ? "30px"
                                                : "initial",
                                            left:
                                              currentDesign.apparel.side === "leftshoulder"
                                                ? "-10px"
                                                : currentDesign.apparel.side === "rightshoulder"
                                                ? "8px"
                                                : "initial",
                                            width:
                                              currentDesign.apparel.side === "leftshoulder" ||
                                              currentDesign.apparel.side === "rightshoulder"
                                                ? "30%"
                                                : "50%",
                                            height:
                                              currentDesign.apparel.side === "leftshoulder" ||
                                              currentDesign.apparel.side === "rightshoulder"
                                                ? "30%"
                                                : "50%",
                                          }}
                                        >
                                          <Image
                                            src={currentDesign.pngImage || "/placeholder.svg"}
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
                                    currentDesign?.uploadedImages?.[currentUploadedImageIndex] && (
                                      <Image
                                        src={
                                          currentDesign.uploadedImages[currentUploadedImageIndex] ||
                                          "/placeholder.svg"
                                        }
                                        alt={`Uploaded image`}
                                        fill
                                        sizes="100%"
                                        className="object-contain"
                                      />
                                    )
                                  )
                                ) : (
                                  <Image
                                    src={currentStandardSide?.url || "/placeholder.svg"}
                                    alt={standardItem.product_details?.title || "Standard Product"}
                                    fill
                                    sizes="100%"
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              {(isDesignable
                                ? designItem.designs && designItem.designs.length > 0
                                : standardSides.length > 0) && (
                                <div className="mt-4 grid grid-cols-4 gap-6">
                                  {isDesignable ? (
                                    viewMode === "apparel" ? (
                                      designItem.designs?.map((design, index) => (
                                        <div
                                          key={index}
                                          className={`relative w-16 h-20 cursor-pointer transition-all duration-200 ${
                                            index === mainDesignIndex
                                              ? "ring-2 ring-gray-700"
                                              : "hover:ring-2 hover:ring-gray-300"
                                          }`}
                                          onClick={() => handleThumbnailClick(item.id, index)}
                                        >
                                          <div className="absolute inset-0">
                                            <Image
                                              src={design.apparel?.url || "/placeholder.svg"}
                                              alt={`Side: ${design.apparel.side}`}
                                              fill
                                              sizes="100%"
                                              priority
                                              className="rounded-none"
                                              style={{
                                                backgroundColor: design.apparel?.color || "#ffffff",
                                                objectFit: "cover",
                                              }}
                                            />
                                          </div>
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
                                                src={design.pngImage || "/placeholder.svg"}
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
                                    ) : (
                                      currentDesign?.uploadedImages?.map((image, index) => (
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
                                            src={image || "/placeholder.svg"}
                                            alt={`Upload ${index + 1}`}
                                            fill
                                            sizes="100%"
                                            className="object-cover"
                                          />
                                        </button>
                                      ))
                                    )
                                  ) : (
                                    standardSides.map((side, index) => (
                                      <div
                                        key={index}
                                        className={`relative w-16 h-20 cursor-pointer transition-all duration-200 ${
                                          index === mainDesignIndex
                                            ? "ring-2 ring-gray-700"
                                            : "hover:ring-2 hover:ring-gray-300"
                                        }`}
                                        onClick={() => handleThumbnailClick(item.id, index)}
                                      >
                                        <Image
                                          src={side.url || "/placeholder.svg"}
                                          alt={`Side: ${side.side}`}
                                          fill
                                          sizes="100%"
                                          className="object-cover"
                                        />
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="md:w-1/2 flex flex-col">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {isDesignable
                                      ? "Custom Designed Product"
                                      : standardItem.product_details?.title || "Standard Product"}
                                  </h3>
                                  <p className="text-sm text-gray-600 mb-1">
                                    {isDesignable
                                      ? `Designed Sides: ${getDesignedSidesText(designItem.designs)}`
                                      : `Size: ${standardItem.selected_size || "N/A"}, Color: ${
                                          standardItem.selected_color
                                            ? typeof standardItem.selected_color === "string"
                                              ? standardItem.selected_color
                                              : standardItem.selected_color || "N/A"
                                            : "N/A"
                                        }`}
                                  </p>
                                  {isDesignable && hasUploadedImages && (
                                    <button
                                      onClick={() => toggleViewMode(item.id)}
                                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                      disabled={loading}
                                    >
                                      {viewMode === "apparel" ? "View Uploaded Images" : "View Design Preview"}
                                    </button>
                                  )}
                                </div>
                                <button
                                  onClick={() => openModal(item.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                  title="Remove item"
                                  disabled={loading}
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="mt-auto pt-6">
                                <div className="flex justify-between items-center mb-4">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      className="w-8 h-8 rounded-full text-black bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                      disabled={updating || loading || item.quantity <= 1}
                                    >
                                      -
                                    </button>
                                    <span className="w-8 text-center text-black font-medium">
                                      {item.quantity}
                                    </span>
                                    <button
                                      className="w-8 h-8 rounded-full text-black bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                      disabled={updating || loading || item.quantity >= 10}
                                    >
                                      +
                                    </button>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-500">Price per item</div>
                                    <div className="font-medium text-black">${pricePerItem.toFixed(2)}</div>
                                  </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-black">Subtotal</span>
                                    <span className="font-medium text-black">${itemTotal.toFixed(2)}</span>
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

          {allCartItems.length > 0 && (
            <div className="lg:w-[380px] flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-8">
                <h2 className="text-xl text-black font-bold mb-6">Order Summary</h2>
                {selectedItems.size > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Selected Items</span>
                      <span className="font-medium text-black">{selectedItems.size}</span>
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
                        <span className="text-black text-lg font-bold">Total</span>
                        <span className="text-black text-lg font-bold">
                          ${calculateSelectedTotals().total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">Please select items to proceed with order</p>
                )}
                <button
                  className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleProceedToOrder}
                  disabled={
                    isOrderLoading ||
                    loading ||
                    selectedItems.size === 0 ||
                    !selectedAddressId ||
                    !customerToken
                  }
                >
                  {isOrderLoading || loading
                    ? "Processing..."
                    : !customerToken
                    ? "Login to proceed"
                    : selectedItems.size === 0
                    ? "Select items to order"
                    : !selectedAddressId
                    ? "Select an address"
                    : "Confirm Order"}
                </button>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
              </div>

              {/* Enhanced Address Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <FaPlus className="w-4 h-4 mr-2" />
                    {isAddingAddress ? "Cancel" : "Add New Address"}
                  </button>
                </div>

                {isAddingAddress ? (
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <Input
                        name="street"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="Enter Street Address"
                        className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <Input
                          name="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="Enter City"
                          className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <Input
                          name="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          placeholder="Enter State"
                          className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode
                      </label>
                      <Input
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="Enter Pincode"
                        className="w-full border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    {addressError && <p className="text-red-500 text-sm">{addressError}</p>}
                    <Button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
                    >
                      Save Address
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {addresses.length === 0 ? (
                      <p className="text-gray-500 text-center">No addresses found. Add one to proceed.</p>
                    ) : (
                      addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`flex items-start space-x-4 p-4 rounded-lg border shadow-sm transition-all duration-200 ${
                            selectedAddressId === addr.id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {addr.street}
                            </p>
                            <p className="text-sm text-gray-700">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{addr.customer_email}</p>
                          </div>
                          <button
                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                            // Add edit functionality here if needed
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Confirm Deletion</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                <XMarkMini className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to remove this item from your cart?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
                onClick={handleConfirmDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;