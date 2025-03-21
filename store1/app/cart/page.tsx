"use client";

import React, { useEffect, useState } from "react";
import { useNewCart } from "../hooks/useNewCart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { ICartItem, IDesignableCartItem, IStandardCartItem } from "@/@types/models";
import { useStore } from "@/context/storecontext";
import { DesignContext } from "@/context/designcontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

const CartPage = () => {
  const {
    cartItems: designableCartItems,
    deleteCartItem,
    updateCartQuantity,
    fetchCartData,
    loading,
    getStandardCartItems,
  } = useNewCart();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const { store } = useStore();

  const designContext = React.useContext(DesignContext);
  const { designs: contextDesigns, dispatchDesign } = designContext || { designs: [], dispatchDesign: () => {} };
  const [selectedDesigns, setSelectedDesigns] = useState<Record<string, number>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [imageViewMode, setImageViewMode] = useState<Record<string, "apparel" | "uploaded">>({});

  const allCartItems: ICartItem[] = [...designableCartItems, ...getStandardCartItems()];

  useEffect(() => {
    const fetchAuthToken = async () => {
      const res = await fetch("/api/auth-token");
      const data = await res.json();
      setAuthToken(data.authToken);
    };
    fetchAuthToken();
  }, []);

  useEffect(() => {
    if (authToken && !isCartLoaded && !loading) {
      fetchCartData()
        .then(() => setIsCartLoaded(true))
        .catch((err) => {
          setError("Failed to load cart");
          toast.error("Failed to load cart");
          console.error("Cart fetch error:", err);
        });
    }
  }, [authToken, fetchCartData, isCartLoaded, loading]);

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
      prev.size === allCartItems.length ? new Set() : new Set(allCartItems.map((item) => item.id))
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
      setIsModalOpen(false);
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
      console.error("Clear cart error:", err);
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
    if (newQuantity <= 0 || newQuantity > 10) {
      setError(newQuantity <= 0 ? "Quantity must be greater than 0" : "Maximum quantity is 10");
      toast.error(newQuantity <= 0 ? "Quantity must be greater than 0" : "Maximum quantity is 10");
      return;
    }
    setUpdating(true);
    try {
      const success = await updateCartQuantity(itemId, newQuantity);
      if (!success) throw new Error("Failed to update quantity");
      toast.success("Quantity updated");
    } catch (error) {
      setError("Failed to update quantity");
      toast.error("Failed to update quantity");
      console.error("Quantity update error:", error);
    } finally {
      setUpdating(false);
    }
  };

  const calculateSelectedTotals = () => {
    const selectedCartItems = allCartItems.filter((item) => selectedItems.has(item.id));
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

  const handleProceedToCheckout = () => {
    if (selectedItems.size === 0) {
      setError("Please select at least one item");
      toast.error("Please select at least one item");
      return;
    }
    if (!authToken) {
      setError("Please log in to proceed");
      toast.error("Please log in to proceed");
      return;
    }
    localStorage.setItem("selectedCartItems", JSON.stringify([...selectedItems]));
    router.push("/order");
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getDesignedSidesText = (designs?: IDesignableCartItem["designs"]) => {
    if (!designs || designs.length === 0) return "N/A";
    const sides = designs.map((design) => capitalizeFirstLetter(design.apparel.side));
    return sides.length === 1 ? sides[0] : sides.slice(0, -1).join(", ") + " & " + sides.slice(-1);
  };

  const handleDesignClick = async (item: ICartItem) => {
    if (item.product_type === "standard") {
      toast.info("This item is not editable");
      return;
    }
    const designItem = item as IDesignableCartItem;
    const { designState, propsState, id } = designItem;

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
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
                {allCartItems.length > 0 && (
                  <div className="flex justify-between space-x-4">
                    <Button
                      onClick={handleSelectAll}
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-200 rounded-lg px-6 py-2"
                      disabled={loading}
                    >
                      {isAllSelected ? "Unselect All" : "Select All"}
                    </Button>
                    <Button
                      onClick={handleClearCart}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 rounded-lg px-6 py-2 shadow-md"
                      disabled={loading}
                    >
                      {loading ? "Clearing..." : "Clear Cart"}
                    </Button>
                  </div>
                )}
              </div>

              {allCartItems.length === 0 ? (
                <div className="p-12 text-center">
                  <svg
                    className="w-24 h-24 mx-auto mb-6 text-gray-300"
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
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart is Empty</h2>
                  <Link href="/" className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {allCartItems.map((item) => {
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
                      <div key={item.id} className="p-6 flex items-start space-x-4 hover:bg-gray-50 transition-all duration-200">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleItemSelect(item.id)}
                          className="mt-6 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200"
                          disabled={loading}
                        />
                        <div className="flex flex-col md:flex-row gap-6 flex-1">
                          <div className="md:w-1/2">
                            <div
                              className="relative w-48 h-56 rounded-lg overflow-hidden bg-gray-50 shadow-sm border border-gray-200 cursor-pointer transition-transform duration-200 hover:scale-105"
                              onClick={() => handleDesignClick(item)}
                            >
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
                                        className={`relative w-12 h-12 rounded-md overflow-hidden shadow-sm border border-gray-200 cursor-pointer transition-transform duration-200 hover:scale-105 ${
                                          index === mainDesignIndex ? "ring-2 ring-blue-500" : ""
                                        }`}
                                        onClick={() => handleThumbnailClick(item.id, index)}
                                      >
                                        <Image
                                          src={design.apparel?.url || "/placeholder.svg"}
                                          alt={`Side: ${design.apparel.side}`}
                                          fill
                                          sizes="100%"
                                          style={{ backgroundColor: design.apparel?.color || "#ffffff", objectFit: "cover" }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <div
                                            className="relative translate-y-[-10%]"
                                            style={{
                                              top: design.apparel.side === "leftshoulder" ? "8px" : design.apparel.side === "rightshoulder" ? "8px" : "initial",
                                              left: design.apparel.side === "leftshoulder" ? "-2px" : design.apparel.side === "rightshoulder" ? "2px" : "initial",
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
                                      <div
                                        key={index}
                                        className={`relative w-12 h-12 rounded-md overflow-hidden shadow-sm border border-gray-200 cursor-pointer transition-transform duration-200 hover:scale-105 ${
                                          index === currentUploadedImageIndex ? "ring-2 ring-blue-500" : ""
                                        }`}
                                        onClick={() => setCurrentImageIndex((prev) => ({ ...prev, [item.id]: index }))}
                                      >
                                        <Image src={image || "/placeholder.svg"} alt={`Upload ${index + 1}`} fill sizes="100%" style={{ objectFit: "cover" }} />
                                      </div>
                                    ))
                                  )
                                ) : (
                                  standardSides.map((side, index) => (
                                    <div
                                      key={index}
                                      className={`relative w-12 h-12 rounded-md overflow-hidden shadow-sm border border-gray-200 cursor-pointer transition-transform duration-200 hover:scale-105 ${
                                        index === mainDesignIndex ? "ring-2 ring-blue-500" : ""
                                      }`}
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
                                <h3 className="text-lg font-semibold text-gray-900">
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
                                    onClick={() => toggleViewMode(item.id)}
                                    className="text-blue-600 hover:text-blue-700 p-0 transition-all duration-200"
                                    disabled={loading}
                                  >
                                    {viewMode === "apparel" ? "View Uploaded Images" : "View Design Preview"}
                                  </Button>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                onClick={() => openModal(item.id)}
                                className="text-gray-500 hover:text-red-600 transition-all duration-200"
                                disabled={loading}
                              >
                                <FaTrash className="w-5 h-5" />
                              </Button>
                            </div>
                            <div className="mt-auto pt-6">
                              <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg w-10 h-10"
                                    disabled={updating || loading || item.quantity <= 1}
                                  >
                                    -
                                  </Button>
                                  <span className="w-12 text-center text-gray-900 font-medium text-lg">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg w-10 h-10"
                                    disabled={updating || loading || item.quantity >= 10}
                                  >
                                    +
                                  </Button>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">Price per item</div>
                                  <div className="font-semibold text-gray-900 text-lg">₹{pricePerItem.toFixed(2)}</div>
                                </div>
                              </div>
                              <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                  <span className="text-base font-semibold text-gray-900">Subtotal</span>
                                  <span className="text-base font-bold text-blue-600">₹{itemTotal.toFixed(2)}</span>
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

          {/* Order Summary Section */}
          {allCartItems.length > 0 && (
            <div className="lg:w-[380px] flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 lg:sticky lg:top-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                {selectedItems.size > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Selected Items</span>
                      <span className="font-medium text-gray-900">{selectedItems.size}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">₹{calculateSelectedTotals().subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax (10%)</span>
                      <span className="font-medium text-gray-900">₹{calculateSelectedTotals().taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-blue-600">₹{calculateSelectedTotals().total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center text-sm font-medium">Please select items to proceed</p>
                )}
                <Button
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition-all duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleProceedToCheckout}
                  disabled={loading || selectedItems.size === 0 || !authToken}
                >
                  Proceed to Checkout
                </Button>
                {error && (
                  <p className="text-red-500 text-sm mt-4 text-center bg-red-50 p-2 rounded-lg border border-red-200">{error}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 p-6 transition-all duration-300 ease-in-out">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-sm mt-2">Are you sure you want to remove this item from your cart?</p>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={closeModal}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 rounded-lg px-6 py-2"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white transition-all duration-200 rounded-lg px-6 py-2 shadow-md"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CartPage;