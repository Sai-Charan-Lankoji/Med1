"use client";

import React, { useEffect, useState } from "react";
import { useNewCart } from "../hooks/useNewCart";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { useRouter } from "next/navigation";
import { useAddresses } from "../hooks/useGetAddress";
import { ICartItem, IDesignableCartItem, IStandardCartItem, Address, OrderData } from "@/@types/models";
import { useStore } from "@/context/storecontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { FaPlus } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const OrderPage = () => {
  const { cartItems: designableCartItems, getStandardCartItems, fetchCartData, loading, deleteCartItem } = useNewCart();
  const { mutate: createOrder, isLoading: isOrderLoading } = useCreateOrder();
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<ICartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { store } = useStore();

  const [customerId, setCustomerId] = useState<string | null>(null);
  const {
    addresses,
    isAddingAddress,
    setIsAddingAddress,
    newAddress,
    setNewAddress,
    addressError,
    handleAddAddress,
    fetchAddresses,
  } = useAddresses(customerId);

  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<string | undefined>(undefined);
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string | undefined>(undefined);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, number>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [imageViewMode, setImageViewMode] = useState<Record<string, "apparel" | "uploaded">>({});
  const [isAddingShipping, setIsAddingShipping] = useState(false);
  const [isAddingBilling, setIsAddingBilling] = useState(false);

  const allCartItems: ICartItem[] = [...designableCartItems, ...getStandardCartItems()];

  useEffect(() => {
    const fetchAuthToken = async () => {
      const res = await fetch("/api/auth-token");
      const data = await res.json();
      setAuthToken(data.authToken);
    };

    fetchAuthToken();

    if (typeof window !== "undefined") {
      const id = sessionStorage.getItem("customerId");
      setCustomerId(id);
    }
  }, []);

  useEffect(() => {
    if (authToken && isLoadingCart && !loading && customerId) {
      fetchCartData()
        .then(() => {
          const selectedIds = JSON.parse(localStorage.getItem("selectedCartItems") || "[]") as string[];
          const selected = allCartItems.filter((item) => selectedIds.includes(item.id));
          setSelectedItems(selected);
          setIsLoadingCart(false);
        })
        .catch((err) => {
          setError("Failed to load cart items");
          toast.error("Failed to load cart items");
          console.error("Cart fetch error:", err);
          setIsLoadingCart(false);
        });
    }
  }, [authToken, fetchCartData, loading, isLoadingCart, allCartItems, customerId]);

  const calculateTotals = () => {
    const subtotal = selectedItems.reduce((total, item) => {
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

  const toggleViewMode = (itemId: string) => {
    setImageViewMode((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === "apparel" ? "uploaded" : "apparel",
    }));
  };

  const handleThumbnailClick = (itemId: string, designIndex: number) => {
    setSelectedDesigns((prev) => ({ ...prev, [itemId]: designIndex }));
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getDesignedSidesText = (designs?: IDesignableCartItem["designs"]) => {
    if (!designs || designs.length === 0) return "N/A";
    const sides = designs.map((design) => capitalizeFirstLetter(design.apparel.side));
    return sides.length === 1 ? sides[0] : sides.slice(0, -1).join(", ") + " & " + sides.slice(-1);
  };

  const handleOrderSubmit = async () => {
    if (!selectedShippingAddressId) {
      setError("Please select a shipping address");
      toast.error("Please select a shipping address");
      return;
    }

    setIsProcessingOrder(true);
    setError(null);

    const customerEmail = sessionStorage.getItem("customerEmail");
    const shippingAddress = addresses.find((addr) => addr.id === selectedShippingAddressId);
    const billingAddress = addresses.find((addr) => addr.id === selectedBillingAddressId) || shippingAddress;

    if (!customerId || !customerEmail || !shippingAddress) {
      setError("Missing customer or address details");
      setIsProcessingOrder(false);
      toast.error("Order failed: Missing details");
      return;
    }

    const { total } = calculateTotals();

    const orderData: OrderData = {
      line_items: selectedItems.map((item) => {
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
            (isDesignable && designItem.designs?.length ? designItem.designs.length * 100 : 100),
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
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    };

    createOrder(orderData, {
      onSuccess: async () => {
        try {
          // Delete each selected item from the cart
          const deletePromises = selectedItems.map((item) => deleteCartItem(item.id));
          await Promise.all(deletePromises);
          localStorage.removeItem("selectedCartItems");
          setSelectedItems([]); // Clear selected items from state
          router.push("/order-confirmation");
          toast.success("Order placed successfully and cart updated");
        } catch (err) {
          setError("Order placed but failed to update cart");
          toast.error("Order placed but failed to update cart");
          console.error("Error deleting cart items:", err);
        } finally {
          setIsProcessingOrder(false);
        }
      },
      onError: (err: any) => {
        setError(err.message || "Failed to place order");
        toast.error(err.message || "Failed to place order");
        setIsProcessingOrder(false);
      },
    });
  };

  if (isLoadingCart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading your order...</p>
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No items selected for order.</p>
          <Link href="/cart">
            <Button>Back to Cart</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-10">Place Your Order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">Order Items</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {selectedItems.map((item) => {
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
                  const hasUploadedImages = isDesignable && currentDesign?.uploadedImages?.some((img) => img?.length > 0);
                  const standardSides = !isDesignable ? getStandardProductSides(standardItem.product_details) : [];
                  const currentStandardSide = !isDesignable ? standardSides[mainDesignIndex] || standardSides[0] : null;

                  return (
                    <div key={item.id} className="p-6 flex items-start space-x-6">
                      <div className="flex flex-col md:flex-row gap-6 flex-1">
                        <div className="md:w-1/2">
                          <div className="relative w-48 h-56 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                            {isDesignable && currentDesign ? (
                              viewMode === "apparel" ? (
                                <>
                                  <Image
                                    src={currentDesign.apparel.url || "/placeholder.svg"}
                                    alt={`Side: ${currentDesign.apparel.side}`}
                                    fill
                                    sizes="100%"
                                    priority
                                    style={{ backgroundColor: currentDesign.apparel?.color || "#ffffff", objectFit: "cover" }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                      className="relative translate-y-[-10%]"
                                      style={{
                                        top: currentDesign.apparel.side === "leftshoulder" ? "35px" : currentDesign.apparel.side === "rightshoulder" ? "30px" : "initial",
                                        left: currentDesign.apparel.side === "leftshoulder" ? "-10px" : currentDesign.apparel.side === "rightshoulder" ? "8px" : "initial",
                                        width: currentDesign.apparel.side === "leftshoulder" || currentDesign.apparel.side === "rightshoulder" ? "30%" : "50%",
                                        height: currentDesign.apparel.side === "leftshoulder" || currentDesign.apparel.side === "rightshoulder" ? "30%" : "50%",
                                      }}
                                    >
                                      <Image
                                        src={currentDesign.pngImage || "/placeholder.svg"}
                                        alt="Design"
                                        fill
                                        sizes="100%"
                                        style={{ objectFit: "contain" }}
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                hasUploadedImages && currentDesign?.uploadedImages?.[currentUploadedImageIndex] && (
                                  <Image
                                    src={currentDesign.uploadedImages[currentUploadedImageIndex] || "/placeholder.svg"}
                                    alt="Uploaded image"
                                    fill
                                    sizes="100%"
                                    style={{ objectFit: "contain" }}
                                  />
                                )
                              )
                            ) : (
                              <Image
                                src={currentStandardSide?.url || "/placeholder.svg"}
                                alt={standardItem.product_details?.title || "Standard Product"}
                                fill
                                sizes="100%"
                                style={{ objectFit: "cover" }}
                              />
                            )}
                          </div>
                          {(isDesignable ? designItem.designs && designItem.designs.length > 0 : standardSides.length > 0) && (
                            <div className="mt-4 grid grid-cols-4 gap-4">
                              {isDesignable ? (
                                viewMode === "apparel" ? (
                                  designItem.designs?.map((design, index) => (
                                    <div
                                      key={index}
                                      className={`relative w-16 h-20 cursor-pointer transition-all duration-200 rounded-md overflow-hidden shadow-sm ${index === mainDesignIndex ? "ring-2 ring-indigo-500" : "hover:ring-2 hover:ring-gray-300"}`}
                                      onClick={() => handleThumbnailClick(item.id, index)}
                                    >
                                      <Image
                                        src={design.apparel?.url || "/placeholder.svg"}
                                        alt={`Side: ${design.apparel.side}`}
                                        fill
                                        sizes="100%"
                                        priority
                                        style={{ backgroundColor: design.apparel?.color || "#ffffff", objectFit: "cover" }}
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                          className="relative translate-y-[-10%]"
                                          style={{
                                            top: design.apparel.side === "leftshoulder" ? "12px" : design.apparel.side === "rightshoulder" ? "12px" : "initial",
                                            left: design.apparel.side === "leftshoulder" ? "-3px" : design.apparel.side === "rightshoulder" ? "2px" : "initial",
                                            width: design.apparel.side === "leftshoulder" || design.apparel.side === "rightshoulder" ? "30%" : "50%",
                                            height: design.apparel.side === "leftshoulder" || design.apparel.side === "rightshoulder" ? "30%" : "50%",
                                          }}
                                        >
                                          <Image
                                            src={design.pngImage || "/placeholder.svg"}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            sizes="100%"
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
                                      className={`aspect-square relative rounded-md overflow-hidden shadow-sm transition-all duration-200 ${index === currentUploadedImageIndex ? "ring-2 ring-indigo-500" : "ring-1 ring-gray-200 hover:ring-2 hover:ring-gray-300"}`}
                                      onClick={() => setCurrentImageIndex((prev) => ({ ...prev, [item.id]: index }))}
                                    >
                                      <Image src={image || "/placeholder.svg"} alt={`Upload ${index + 1}`} fill sizes="100%" style={{ objectFit: "cover" }} />
                                    </button>
                                  ))
                                )
                              ) : (
                                standardSides.map((side, index) => (
                                  <div
                                    key={index}
                                    className={`relative w-16 h-20 cursor-pointer transition-all duration-200 rounded-md overflow-hidden shadow-sm ${index === mainDesignIndex ? "ring-2 ring-indigo-500" : "hover:ring-2 hover:ring-gray-300"}`}
                                    onClick={() => handleThumbnailClick(item.id, index)}
                                  >
                                    <Image src={side.url || "/placeholder.svg"} alt={`Side: ${side.side}`} fill sizes="100%" style={{ objectFit: "cover" }} />
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                        <div className="md:w-1/2 flex flex-col">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {isDesignable ? "Custom Designed Product" : standardItem.product_details?.title || "Standard Product"}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
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
                                <Button
                                  variant="link"
                                  className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                                  onClick={() => toggleViewMode(item.id)}
                                  disabled={loading}
                                >
                                  {viewMode === "apparel" ? "View Uploaded Images" : "View Design Preview"}
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="mt-auto pt-6">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">Price per item</div>
                                <div className="font-medium text-gray-800">${pricePerItem.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800">Subtotal</span>
                                <span className="font-medium text-gray-800">${itemTotal.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 transition-all duration-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Details</h2>

              {/* Shipping Address */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Shipping Address</h3>
                {isAddingShipping ? (
                  <div className="space-y-4 animate-fade-in">
                    <Input
                      name="street"
                      value={newAddress.street || ""}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value, address_type: "shipping" })}
                      placeholder="Street Address"
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm transition-all duration-200"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="city"
                        value={newAddress.city || ""}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="City"
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm transition-all duration-200"
                        required
                      />
                      <Input
                        name="state"
                        value={newAddress.state || ""}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        placeholder="State"
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm transition-all duration-200"
                        required
                      />
                    </div>
                    <Input
                      name="pincode"
                      value={newAddress.pincode || ""}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      placeholder="Pincode"
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm transition-all duration-200"
                      required
                    />
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        onClick={() => setIsAddingShipping(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200"
                        onClick={handleAddAddress}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <RadioGroup value={selectedShippingAddressId} onValueChange={setSelectedShippingAddressId} className="space-y-2">
                      {addresses.filter((addr) => addr.address_type === "shipping").map((addr) => (
                        <div
                          key={addr.id}
                          className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-all duration-200"
                        >
                          <RadioGroupItem value={addr.id} id={addr.id} className="text-indigo-600" />
                          <Label htmlFor={addr.id} className="text-gray-700">
                            {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button
                      variant="link"
                      className="mt-3 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                      onClick={() => setIsAddingShipping(true)}
                    >
                      <FaPlus className="mr-2" /> Add New Shipping Address
                    </Button>
                  </>
                )}
              </div>

              {/* Billing Address */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Billing Address</h3>
                {isAddingBilling ? (
                  <div className="space-y-4 animate-fade-in">
                    <Input
                      name="street"
                      value={newAddress.street || ""}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value, address_type: "billing" })}
                      placeholder="Street Address"
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm transition-all duration-200"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="city"
                        value={newAddress.city || ""}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="City"
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm transition-all duration-200"
                        required
                      />
                      <Input
                        name="state"
                        value={newAddress.state || ""}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        placeholder="State"
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm transition-all duration-200"
                        required
                      />
                    </div>
                    <Input
                      name="pincode"
                      value={newAddress.pincode || ""}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      placeholder="Pincode"
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm transition-all duration-200"
                      required
                    />
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        onClick={() => setIsAddingBilling(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200"
                        onClick={handleAddAddress}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <RadioGroup value={selectedBillingAddressId} onValueChange={setSelectedBillingAddressId} className="space-y-2">
                      {addresses.filter((addr) => addr.address_type === "billing").map((addr) => (
                        <div
                          key={addr.id}
                          className="flex items-center space-x-2 p-3 border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-all duration-200"
                        >
                          <RadioGroupItem value={addr.id} id={addr.id} className="text-indigo-600" />
                          <Label htmlFor={addr.id} className="text-gray-700">
                            {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button
                      variant="link"
                      className="mt-3 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                      onClick={() => setIsAddingBilling(true)}
                    >
                      <FaPlus className="mr-2" /> Add New Billing Address
                    </Button>
                  </>
                )}
              </div>

              {/* Order Summary and Submit */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>${calculateTotals().subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Tax (10%)</span>
                  <span>${calculateTotals().taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-800 mb-4">
                  <span>Total</span>
                  <span>${calculateTotals().total.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-md shadow-md transition-all duration-200"
                  onClick={handleOrderSubmit}
                  disabled={isOrderLoading || isProcessingOrder || !selectedShippingAddressId}
                >
                  {isProcessingOrder || isOrderLoading ? "Placing Order..." : "Place Order"}
                </Button>
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for Smooth Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default OrderPage;