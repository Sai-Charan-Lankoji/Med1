"use client";

import { useEffect, useMemo, useState } from "react";
import { useNewCart } from "../hooks/useNewCart";
import { useRouter } from "next/navigation";
import { useAddresses } from "../hooks/useGetAddress";
import type { ICartItem, IDesignableCartItem, IStandardCartItem, OrderData } from "@/@types/models";
import { useStore } from "@/context/storecontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  Plus,
  CreditCard,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageIcon,
  MapPin,
  Home,
  Building,
  ShoppingBag,
  Check,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const OrderPage = () => {
  const { cartItems: designableCartItems, getStandardCartItems, fetchCartData, loading, deleteCartItem } = useNewCart();
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
  const [paymentMethod, setPaymentMethod] = useState<"phonepe" | "">("");
  const [activeStep, setActiveStep] = useState<"items" | "shipping" | "payment">("items");
  const [addressFormErrors, setAddressFormErrors] = useState<Record<string, string>>({});

  const allCartItems: ICartItem[] = useMemo(
    () => [...designableCartItems, ...getStandardCartItems()],
    [designableCartItems, getStandardCartItems]
  );

  useEffect(() => {
    const fetchAuthToken = async () => {
      const res = await fetch("/api/auth-token");
      const data = await res.json();
      setAuthToken(data.authToken);
    };

    fetchAuthToken();

    if (typeof window !== "undefined") {
      const id = sessionStorage.getItem("customerId");
      if (!id) {
        setError("Customer ID not found. Please log in.");
        toast.error("Please log in to place an order.");
      } else {
        setCustomerId(id);
      }
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

  useEffect(() => {
    if (addresses.length > 0 && !selectedShippingAddressId) {
      const shippingAddresses = addresses.filter((addr) => addr.address_type === "shipping");
      if (shippingAddresses.length > 0) {
        setSelectedShippingAddressId(shippingAddresses[0].id);
      }
    }

    if (addresses.length > 0 && !selectedBillingAddressId) {
      const billingAddresses = addresses.filter((addr) => addr.address_type === "billing");
      if (billingAddresses.length > 0) {
        setSelectedBillingAddressId(billingAddresses[0].id);
      }
    }
  }, [addresses, selectedShippingAddressId, selectedBillingAddressId]);

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

  const validateAddressForm = () => {
    const errors: Record<string, string> = {};
    if (!newAddress.street || newAddress.street.trim() === "") errors.street = "Street address is required";
    if (!newAddress.city || newAddress.city.trim() === "") errors.city = "City is required";
    if (!newAddress.state || newAddress.state.trim() === "") errors.state = "State is required";
    if (!newAddress.pincode || newAddress.pincode.trim() === "") {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(newAddress.pincode)) {
      errors.pincode = "Pincode must be 6 digits";
    }
    setAddressFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOrderSubmit = async () => {
    if (!selectedShippingAddressId) {
      setError("Please select a shipping address");
      toast.error("Please select a shipping address");
      setActiveStep("shipping");
      return;
    }
    if (!paymentMethod) {
      setError("Please select a payment method");
      toast.error("Please select a payment method");
      return;
    }
    if (!customerId) {
      setError("Customer ID not found. Please log in.");
      toast.error("Customer ID not found. Please log in.");
      return;
    }

    setIsProcessingOrder(true);
    setError(null);

    const customerEmail = sessionStorage.getItem("customerEmail");
    const shippingAddress = addresses.find((addr) => addr.id === selectedShippingAddressId);
    const billingAddress = addresses.find((addr) => addr.id === selectedBillingAddressId) || shippingAddress;

    if (!customerEmail || !shippingAddress) {
      setError("Missing customer email or address details");
      toast.error("Order failed: Missing details");
      setIsProcessingOrder(false);
      return;
    }

    const { total } = calculateTotals();

    const orderData: OrderData = {
      line_items: selectedItems.map((item) => {
        const isDesignable = item.product_type === "designable";
        const designItem = item as IDesignableCartItem;
        const standardItem = item as IStandardCartItem;
        const title = isDesignable ? "Custom Designed Product" : standardItem.product_details?.title || "Standard Product";
        const images = isDesignable
          ? (designItem.designs || []).map((design) => design.pngImage || design.apparel?.url || "").filter(Boolean)
          : getStandardProductSides(standardItem.product_details).map((side) => side.url).filter(Boolean);

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price || (isDesignable && designItem.designs?.length ? designItem.designs.length * 100 : 100),
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
      currency_code: "INR",
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

    if (paymentMethod === "phonepe") {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/phonepe/initiate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ orderData, amount: total * 100 }),
        });

        const paymentData = await response.json();

        if (response.status === 429) {
          const retryAfter = paymentData.retryAfter || 60;
          setError(
            `Order ${paymentData.orderId} placed, but payment failed due to too many requests. Retry after ${retryAfter} seconds.`
          );
          toast.warn(`Order ${paymentData.orderId} placed, but payment failed. Retry after ${retryAfter}s.`);
          await Promise.all(selectedItems.map((item) => deleteCartItem(item.id)));
          localStorage.removeItem("selectedCartItems");
          setSelectedItems([]);
          setIsProcessingOrder(false);
          router.push(`/order-confirmation?orderId=${paymentData.orderId}`);
          return;
        }

        if (!paymentData.success) {
          setError(
            `Order ${paymentData.orderId} placed, but payment failed: ${paymentData.message || "Unknown error"}`
          );
          toast.warn(`Order ${paymentData.orderId} placed, but payment failed. Please try paying again.`);
          await Promise.all(selectedItems.map((item) => deleteCartItem(item.id)));
          localStorage.removeItem("selectedCartItems");
          setSelectedItems([]);
          setIsProcessingOrder(false);
          router.push(`/order-confirmation?orderId=${paymentData.orderId}`);
          return;
        }

        if (paymentData.success && paymentData.data.instrumentResponse.redirectInfo) {
          sessionStorage.setItem("pendingOrderId", paymentData.orderId);
          window.location.href = paymentData.data.instrumentResponse.redirectInfo.url;
        } else {
          throw new Error("Redirect URL missing in payment response");
        }
      } catch (err: any) {
        setError(err.message || "Payment initiation failed");
        toast.error(err.message || "Payment initiation failed");
        setIsProcessingOrder(false);
      }
    }
  };

  const renderAddressForm = (type: "shipping" | "billing") => (
    <form
      onSubmit={handleAddAddress}
      className="space-y-6 p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 ease-in-out"
    >
      <div className="space-y-2">
        <Label htmlFor={`${type}-street`} className="text-sm font-semibold text-gray-700">
          Street Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${type}-street`}
          name="street"
          value={newAddress.street || ""}
          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value, address_type: type })}
          placeholder="Enter your street address"
          className={`rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
            addressFormErrors.street ? "border-red-500 focus:ring-red-500" : ""
          }`}
          required
        />
        {addressFormErrors.street && <p className="text-sm text-red-500">{addressFormErrors.street}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${type}-city`} className="text-sm font-semibold text-gray-700">
          City <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${type}-city`}
          name="city"
          value={newAddress.city || ""}
          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
          placeholder="Enter your city"
          className={`rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
            addressFormErrors.city ? "border-red-500 focus:ring-red-500" : ""
          }`}
          required
        />
        {addressFormErrors.city && <p className="text-sm text-red-500">{addressFormErrors.city}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${type}-state`} className="text-sm font-semibold text-gray-700">
          State <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${type}-state`}
          name="state"
          value={newAddress.state || ""}
          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
          placeholder="Enter your state"
          className={`rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
            addressFormErrors.state ? "border-red-500 focus:ring-red-500" : ""
          }`}
          required
        />
        {addressFormErrors.state && <p className="text-sm text-red-500">{addressFormErrors.state}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${type}-pincode`} className="text-sm font-semibold text-gray-700">
          Pincode <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${type}-pincode`}
          name="pincode"
          value={newAddress.pincode || ""}
          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
          placeholder="Enter 6-digit pincode"
          className={`rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
            addressFormErrors.pincode ? "border-red-500 focus:ring-red-500" : ""
          }`}
          maxLength={6}
          required
        />
        {addressFormErrors.pincode && <p className="text-sm text-red-500">{addressFormErrors.pincode}</p>}
      </div>
      <div className="flex space-x-4 pt-4">
        <Button
          variant="outline"
          onClick={() => (type === "shipping" ? setIsAddingShipping(false) : setIsAddingBilling(false))}
          className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg"
          type="button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 rounded-lg"
        >
          Save Address
        </Button>
      </div>
    </form>
  );

  if (isLoadingCart) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-blue-600 h-12 w-12 mb-4" />
        <p className="text-gray-700 text-lg font-medium">Loading your order details...</p>
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-200">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">No items selected for checkout.</p>
          <Link href="/cart">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 rounded-lg">
              Return to Cart
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link href="/cart" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Back to Cart</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Checkout</h1>
          <div className="w-24"></div>
        </div>

        {/* Checkout Progress */}
        <div className="mb-10 hidden sm:block">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-between">
              {["items", "shipping", "payment"].map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-in-out ${
                      activeStep === step
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-500 border-2 border-gray-200"
                    } text-lg font-semibold`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                      activeStep === step ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {step === "items" ? "Review Items" : step === "shipping" ? "Shipping" : "Payment"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="mb-8 sm:hidden">
          <Tabs value={activeStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3 gap-2 bg-gray-200 p-2 rounded-lg">
              {["items", "shipping", "payment"].map((step) => (
                <TabsTrigger
                  key={step}
                  value={step}
                  onClick={() => setActiveStep(step as "items" | "shipping" | "payment")}
                  className={`capitalize py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeStep === step ? "bg-blue-600 text-white shadow" : "bg-white text-gray-700"
                  }`}
                >
                  {step}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Review Items Section */}
            <Card
              className={`transition-all duration-300 ease-in-out ${
                activeStep !== "items" ? "hidden lg:block opacity-50" : "opacity-100"
              } bg-white rounded-xl shadow-lg border border-gray-200`}
            >
              <CardHeader className="p-6 border-b border-gray-100">
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <ShoppingBag className="h-6 w-6 mr-3 text-blue-600" />
                  Order Items
                  <Badge variant="outline" className="ml-auto border-gray-300 text-gray-700">
                    {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {selectedItems.map((item) => {
                    const isDesignable = item.product_type === "designable";
                    const designItem = item as IDesignableCartItem;
                    const standardItem = item as IStandardCartItem;
                    const pricePerItem = isDesignable ? (designItem.designs?.length || 0) * 100 : standardItem.price || 100;
                    const itemTotal = pricePerItem * item.quantity;
                    const mainDesignIndex = selectedDesigns[item.id] || 0;
                    const currentDesign = isDesignable ? designItem.designs?.[mainDesignIndex] : null;
                    const currentUploadedImageIndex = currentImageIndex[item.id] || 0;
                    const viewMode = imageViewMode[item.id] || "apparel";
                    const hasUploadedImages = isDesignable && currentDesign?.uploadedImages?.some((img) => img?.length > 0);
                    const standardSides = !isDesignable ? getStandardProductSides(standardItem.product_details) : [];
                    const currentStandardSide = !isDesignable ? standardSides[mainDesignIndex] || standardSides[0] : null;

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row gap-6 border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                      >
                        <div className="sm:w-1/3 flex-shrink-0">
                          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 shadow-sm border border-gray-200">
                            {isDesignable && currentDesign ? (
                              viewMode === "apparel" ? (
                                <>
                                  <Image
                                    src={currentDesign.apparel.url || "/placeholder.svg"}
                                    alt={`Side: ${currentDesign.apparel.side}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{
                                      backgroundColor: currentDesign.apparel?.color || "#ffffff",
                                      objectFit: "cover",
                                    }}
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
                                        sizes="50vw"
                                        style={{ objectFit: "contain" }}
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                hasUploadedImages &&
                                currentDesign?.uploadedImages?.[currentUploadedImageIndex] && (
                                  <Image
                                    src={currentDesign.uploadedImages[currentUploadedImageIndex] || "/placeholder.svg"}
                                    alt="Uploaded image"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ objectFit: "contain" }}
                                  />
                                )
                              )
                            ) : (
                              <Image
                                src={currentStandardSide?.url || "/placeholder.svg"}
                                alt={standardItem.product_details?.title || "Standard Product"}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                style={{ objectFit: "cover" }}
                              />
                            )}
                          </div>
                          {(isDesignable ? designItem.designs && designItem.designs.length > 0 : standardSides.length > 0) && (
                            <div className="mt-4 grid grid-cols-4 gap-2">
                              {isDesignable
                                ? viewMode === "apparel"
                                  ? designItem.designs?.map((design, index) => (
                                      <button
                                        key={index}
                                        className={`relative w-full aspect-square cursor-pointer rounded-md overflow-hidden shadow-sm border border-gray-200 transition-transform duration-200 hover:scale-105 ${
                                          index === mainDesignIndex ? "ring-2 ring-blue-500" : ""
                                        }`}
                                        onClick={() => handleThumbnailClick(item.id, index)}
                                        aria-label={`View ${design.apparel.side} design`}
                                      >
                                        <Image
                                          src={design.apparel?.url || "/placeholder.svg"}
                                          alt={`Side: ${design.apparel.side}`}
                                          fill
                                          sizes="25vw"
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
                                              sizes="25vw"
                                              style={{ objectFit: "contain" }}
                                            />
                                          </div>
                                        </div>
                                      </button>
                                    ))
                                  : currentDesign?.uploadedImages?.map((image, index) => (
                                      <button
                                        key={index}
                                        className={`relative w-full aspect-square rounded-md overflow-hidden shadow-sm border border-gray-200 transition-transform duration-200 hover:scale-105 ${
                                          index === currentUploadedImageIndex ? "ring-2 ring-blue-500" : ""
                                        }`}
                                        onClick={() => setCurrentImageIndex((prev) => ({ ...prev, [item.id]: index }))}
                                        aria-label={`View uploaded image ${index + 1}`}
                                      >
                                        <Image
                                          src={image || "/placeholder.svg"}
                                          alt={`Upload ${index + 1}`}
                                          fill
                                          sizes="25vw"
                                          style={{ objectFit: "cover" }}
                                        />
                                      </button>
                                    ))
                                : standardSides.map((side, index) => (
                                    <button
                                      key={index}
                                      className={`relative w-full aspect-square cursor-pointer rounded-md overflow-hidden shadow-sm border border-gray-200 transition-transform duration-200 hover:scale-105 ${
                                        index === mainDesignIndex ? "ring-2 ring-blue-500" : ""
                                      }`}
                                      onClick={() => handleThumbnailClick(item.id, index)}
                                      aria-label={`View ${side.side} side`}
                                    >
                                      <Image
                                        src={side.url || "/placeholder.svg"}
                                        alt={`Side: ${side.side}`}
                                        fill
                                        sizes="25vw"
                                        style={{ objectFit: "cover" }}
                                      />
                                    </button>
                                  ))}
                            </div>
                          )}
                        </div>

                        <div className="sm:w-2/3 flex flex-col">
                          <h3 className="text-lg font-semibold text-gray-900">{isDesignable ? "Custom Designed Product" : standardItem.product_details?.title || "Standard Product"}</h3>
                          <div className="mt-2 space-y-2 text-sm text-gray-600">
                            <p>
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
                            <p>Quantity: {item.quantity}</p>
                          </div>
                          {isDesignable && hasUploadedImages && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3 w-fit border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg"
                              onClick={() => toggleViewMode(item.id)}
                            >
                              {viewMode === "apparel" ? (
                                <>
                                  <ImageIcon className="h-4 w-4 mr-2" />
                                  View Uploaded Images
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Design Preview
                                </>
                              )}
                            </Button>
                          )}
                          <div className="mt-auto pt-4 flex flex-wrap justify-between items-end gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Price per item</p>
                              <p className="text-lg font-semibold text-gray-900">₹{pricePerItem.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Subtotal</p>
                              <p className="text-lg font-bold text-blue-600">₹{itemTotal.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={() => setActiveStep("shipping")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md"
                  >
                    Continue to Shipping <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Section */}
            <Card
              className={`transition-all duration-300 ease-in-out ${
                activeStep !== "shipping" ? "hidden lg:block opacity-50" : "opacity-100"
              } bg-white rounded-xl shadow-lg border border-gray-200`}
            >
              <CardHeader className="p-6 border-b border-gray-100">
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-6 w-6 mr-3 text-blue-600" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isAddingShipping ? (
                  renderAddressForm("shipping")
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Select a Shipping Address</h3>
                      {addresses.filter((addr) => addr.address_type === "shipping").length === 0 ? (
                        <div className="bg-gray-50 p-6 rounded-lg text-center border border-gray-200">
                          <p className="text-gray-600 mb-4">No shipping addresses found</p>
                          <Button
                            variant="outline"
                            onClick={() => setIsAddingShipping(true)}
                            className="border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg"
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add Shipping Address
                          </Button>
                        </div>
                      ) : (
                        <>
                          <RadioGroup
                            value={selectedShippingAddressId}
                            onValueChange={setSelectedShippingAddressId}
                            className="space-y-4"
                          >
                            {addresses
                              .filter((addr) => addr.address_type === "shipping")
                              .map((addr) => (
                                <div
                                  key={addr.id}
                                  className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                                    selectedShippingAddressId === addr.id
                                      ? "border-blue-500 bg-blue-50 shadow-md"
                                      : "border-gray-200 hover:border-gray-300 bg-white"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={addr.id}
                                    id={`shipping-${addr.id}`}
                                    className="mt-1 text-blue-600"
                                  />
                                  <div className="flex-1">
                                    <Label
                                      htmlFor={`shipping-${addr.id}`}
                                      className={`flex items-center text-base font-semibold ${
                                        selectedShippingAddressId === addr.id ? "text-blue-600" : "text-gray-900"
                                      }`}
                                    >
                                      <Home className="h-5 w-5 mr-2" />
                                      Shipping Address
                                      {selectedShippingAddressId === addr.id && (
                                        <Badge className="ml-2 bg-blue-100 text-blue-600 border-blue-200">Selected</Badge>
                                      )}
                                    </Label>
                                    <p className="mt-1 text-gray-700 text-sm">
                                      {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </RadioGroup>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingShipping(true)}
                            className="mt-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg"
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add New Address
                          </Button>
                        </>
                      )}
                    </div>

                    <Separator className="my-6 bg-gray-200" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Billing Address</h3>
                      {isAddingBilling ? (
                        renderAddressForm("billing")
                      ) : (
                        <>
                          <div className="flex items-center mb-4">
                            <input
                              type="checkbox"
                              id="same-as-shipping"
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
                              checked={!selectedBillingAddressId || selectedBillingAddressId === selectedShippingAddressId}
                              onChange={() => {
                                if (selectedBillingAddressId === selectedShippingAddressId) {
                                  const billingAddr = addresses.find(
                                    (addr) => addr.address_type === "billing" && addr.id !== selectedShippingAddressId
                                  );
                                  setSelectedBillingAddressId(billingAddr?.id);
                                } else {
                                  setSelectedBillingAddressId(selectedShippingAddressId);
                                }
                              }}
                            />
                            <label htmlFor="same-as-shipping" className="ml-2 text-sm text-gray-700 font-medium">
                              Same as shipping address
                            </label>
                          </div>
                          {selectedBillingAddressId !== selectedShippingAddressId && (
                            <RadioGroup
                              value={selectedBillingAddressId}
                              onValueChange={setSelectedBillingAddressId}
                              className="space-y-4"
                            >
                              {addresses
                                .filter((addr) => addr.address_type === "billing")
                                .map((addr) => (
                                  <div
                                    key={addr.id}
                                    className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                                      selectedBillingAddressId === addr.id
                                        ? "border-blue-500 bg-blue-50 shadow-md"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                    }`}
                                  >
                                    <RadioGroupItem
                                      value={addr.id}
                                      id={`billing-${addr.id}`}
                                      className="mt-1 text-blue-600"
                                    />
                                    <div className="flex-1">
                                      <Label
                                        htmlFor={`billing-${addr.id}`}
                                        className={`flex items-center text-base font-semibold ${
                                          selectedBillingAddressId === addr.id ? "text-blue-600" : "text-gray-900"
                                        }`}
                                      >
                                        <Building className="h-5 w-5 mr-2" />
                                        Billing Address
                                        {selectedBillingAddressId === addr.id && (
                                          <Badge className="ml-2 bg-blue-100 text-blue-600 border-blue-200">Selected</Badge>
                                        )}
                                      </Label>
                                      <p className="mt-1 text-gray-700 text-sm">
                                        {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                            </RadioGroup>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingBilling(true)}
                            className="mt-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg"
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add New Billing Address
                          </Button>
                        </>
                      )}
                    </div>

                    <div className="mt-8 flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setActiveStep("items")}
                        className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg px-6 py-2"
                      >
                        <ChevronLeft className="h-5 w-5 mr-2" /> Back to Items
                      </Button>
                      <Button
                        onClick={() => {
                          if (!selectedShippingAddressId) {
                            toast.error("Please select a shipping address");
                            return;
                          }
                          setActiveStep("payment");
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md"
                      >
                        Continue to Payment <ChevronRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card
              className={`transition-all duration-300 ease-in-out ${
                activeStep !== "payment" ? "hidden lg:block opacity-50" : "opacity-100"
              } bg-white rounded-xl shadow-lg border border-gray-200`}
            >
              <CardHeader className="p-6 border-b border-gray-100">
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Select a Payment Method</h3>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as "phonepe")}
                      className="space-y-4"
                    >
                      <div
                        className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-200 ${
                          paymentMethod === "phonepe" ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <RadioGroupItem value="phonepe" id="phonepe" className="text-blue-600" />
                        <Label
                          htmlFor="phonepe"
                          className={`flex items-center text-base font-semibold ${
                            paymentMethod === "phonepe" ? "text-blue-600" : "text-gray-900"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shadow-sm">
                              <CreditCard className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                              <span className="block text-gray-900 font-medium">PhonePe (UAT)</span>
                              <span className="text-xs text-gray-500">Test payment gateway</span>
                            </div>
                            {paymentMethod === "phonepe" && <Check className="ml-auto h-5 w-5 text-blue-600" />}
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    {!paymentMethod && (
                      <div className="flex items-center mt-2 text-amber-600 bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p className="text-sm font-medium">Please select a payment method to continue</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveStep("shipping")}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg px-6 py-2"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" /> Back to Shipping
                    </Button>
                    <Button
                      onClick={handleOrderSubmit}
                      disabled={isProcessingOrder || !selectedShippingAddressId || !paymentMethod || !customerId}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isProcessingOrder ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Order <ChevronRight className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-10 bg-white rounded-xl shadow-lg border border-gray-200">
              <CardHeader className="p-6 border-b border-gray-100">
                <CardTitle className="text-2xl font-semibold text-gray-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Items ({selectedItems.length})</span>
                    <span className="font-medium text-gray-900">₹{calculateTotals().subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-gray-900">₹{calculateTotals().shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (10%)</span>
                    <span className="font-medium text-gray-900">₹{calculateTotals().taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">₹{calculateTotals().total.toFixed(2)}</span>
                  </div>
                  <div className="pt-4">
                    {activeStep === "items" && (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all duration-200 shadow-md"
                        onClick={() => setActiveStep("shipping")}
                      >
                        Continue to Shipping
                      </Button>
                    )}
                    {activeStep === "shipping" && (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all duration-200 shadow-md"
                        onClick={() => {
                          if (!selectedShippingAddressId) {
                            toast.error("Please select a shipping address");
                            return;
                          }
                          setActiveStep("payment");
                        }}
                      >
                        Continue to Payment
                      </Button>
                    )}
                    {activeStep === "payment" && (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={handleOrderSubmit}
                        disabled={isProcessingOrder || !selectedShippingAddressId || !paymentMethod || !customerId}
                      >
                        {isProcessingOrder ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                            Processing...
                          </>
                        ) : (
                          "Complete Order"
                        )}
                      </Button>
                    )}
                  </div>
                  
                </div>
                <div className="mt-6 text-xs text-gray-500 space-y-2">
                  <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
                  <p>All prices are inclusive of applicable taxes.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;