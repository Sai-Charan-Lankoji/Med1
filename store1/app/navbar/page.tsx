"use client";

import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaShoppingCart,
  FaSignOutAlt,
  FaCog,
  FaHeart,
} from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { ShirtIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MdDeleteForever } from "react-icons/md";
import { useUserContext } from "@/context/userContext";
import { useCustomerLogout } from "../hooks/useCustomerLogout";
import { useRouter, useParams } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import { DesignContext } from "@/context/designcontext";
import { useNewCart } from "../hooks/useNewCart";
import { IDesign, IProps, ICartItem, IDesignableCartItem, IStandardCartItem } from "@/@types/models";
import { useDesignSwitcher } from "../hooks/useDesignSwitcher";
import { useStore } from "@/context/storecontext";
import useSWR from "swr";

// Wishlist Interface
interface WishlistItem {
  id: string;
  customer_id: string;
  product_id: string | null;
  standard_product_id: string | null;
}

interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: WishlistItem[] | null;
  error?: { code: string; details: string };
}

const WISHLIST_API_URL = "http://localhost:5000/api/wishlists";
const POLLING_INTERVAL = 5000;

// Fetcher function for SWR
const fetcher = async (url: string, token: string | null) => {
  if (!token) {
    throw new Error("No authentication token provided");
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = (await response.json()) as ApiResponse;
  if (data.status !== 200 || !data.success) {
    throw new Error(data.message || "Failed to fetch wishlist");
  }

  return data.data as WishlistItem[];
};

const Navbar: React.FC = () => {
  const { cartItems: designableCartItems, deleteCart, fetchCartData, getStandardCartItems } = useNewCart();
  const { email, customerToken, profile } = useUserContext();
  const [username, setUsername] = useState<string>("");
  const { logout } = useCustomerLogout();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [token, setToken] = useState<string | null>(null);
  const params = useParams();
  const { store } = useStore();
  const vendorId = params.vendorId as string;
  const isVendorMode = vendorId === store?.vendor_id;

  // Combine designable and standard cart items
  const allCartItems: ICartItem[] = React.useMemo(() => [
    ...designableCartItems,
    ...getStandardCartItems(),
  ], [designableCartItems, getStandardCartItems]);

  // Fetch token on client-side
  useEffect(() => {
    const authToken =
      typeof window !== "undefined" ? sessionStorage.getItem("auth_token") : null;
    setToken(authToken);
  }, []);

  // Fetch cart data on mount
  useEffect(() => {
    if (customerToken) {
      fetchCartData();
    }
  }, [customerToken, fetchCartData]);

  // Use SWR to fetch and monitor wishlist items
  const { data: wishlistData, error: wishlistError } = useSWR(
    token ? [WISHLIST_API_URL, token] : null,
    ([url, token]) => fetcher(url, token),
    {
      refreshInterval: POLLING_INTERVAL,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 2000,
    }
  );

  // Update wishlistCount based on SWR data
  useEffect(() => {
    if (wishlistData) {
      setWishlistCount(wishlistData.length);
    } else if (wishlistError || !token) {
      setWishlistCount(0);
    }
  }, [wishlistData, wishlistError, token]);

  useEffect(() => {
    if (email) {
      const storedUsername = sessionStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [email]);

  useEffect(() => {
    if (customerToken && Array.isArray(allCartItems)) {
      try {
        const totalItems = allCartItems.length;
        setCartItemsCount(totalItems);
        const total = allCartItems.reduce((sum, item) => {
          if (!item) return sum;
          const numberOfSides = item.product_type === "designable" && item.designs?.length ? item.designs.length : 1;
          return sum + (item.price || 100) * numberOfSides * (item.quantity || 1);
        }, 0);
        setCartTotal(total);
      } catch (error) {
        console.error("Error calculating cart totals:", error);
        setCartItemsCount(0);
        setCartTotal(0);
      }
    } else {
      setCartItemsCount(0);
      setCartTotal(0);
    }
  }, [allCartItems, customerToken]);

  const designContext = React.useContext(DesignContext);
  const { designs, dispatchDesign } = designContext || {
    designs: [],
    dispatchDesign: () => {},
  };

  const { switchToDesign } = useDesignSwitcher();

  const handleDesignClick = async (
    designState: IDesign,
    propsState: IProps,
    id: any
  ) => {
    localStorage.setItem("savedDesignState", JSON.stringify(designState));
    localStorage.setItem("savedPropsState", JSON.stringify(propsState));
    localStorage.setItem("cart_id", id);
    dispatchDesign({ type: "SWITCH_DESIGN", currentDesign: designState });

    window.location.reload();

    const success = await switchToDesign(designState);

    if (success) {
      setIsCartOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
      const canvasElement = document.querySelector(".canvas-container");
      if (canvasElement) {
        canvasElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const closeAllMenus = () => {
    setIsCartOpen(false);
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleDeleteCart = async (cartId: string) => {
    const success = await deleteCart(cartId);
    if (success) {
      localStorage.removeItem("savedDesignState");
      localStorage.removeItem("cart_id");
      router.refresh();
    } else {
      console.log("Failed to delete cart item");
    }
  };

  const handleDesktopCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!customerToken) {
      router.push("/auth");
      closeAllMenus();
    } else {
      setIsCartOpen((prev) => !prev);
      setIsProfileOpen(false);
    }
  };

  const handleDesktopProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileOpen((prev) => !prev);
    setIsCartOpen(false);
  };

  const handleDesktopLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await logout();
      closeAllMenus();
      router.push("/");
    } catch (error) {
      console.error("Desktop logout failed:", error);
    }
  };

  const handleDesktopWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!customerToken) {
      router.push("/auth");
    } else {
      router.push("/wishlist");
    }
    closeAllMenus();
  };

  const handleMobileMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen((prev) => !prev);
    setIsCartOpen(false);
    setIsProfileOpen(false);
  };

  const handleMobileCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!customerToken) {
      router.push("/auth");
    } else {
      router.push("/cart");
    }
    closeAllMenus();
  };

  const handleMobileWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!customerToken) {
      router.push("/auth");
    } else {
      router.push("/wishlist");
    }
    closeAllMenus();
  };

  const handleMobileLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await logout();
      closeAllMenus();
      router.push("/");
    } catch (error) {
      console.error("Mobile logout failed:", error);
    }
  };

  const handleViewCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (customerToken) {
      router.push("/cart");
    }
    closeAllMenus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".cart-dropdown") &&
        !target.closest(".profile-dropdown") &&
        !target.closest(".mobile-menu-button")
      ) {
        setIsCartOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const capitalizeFirstLetter = (string: string) => {
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

  // Helper function to extract available sides for standard products
  const getStandardProductSides = (productDetails: any) => {
    const sides = [];
    if (productDetails?.front_image) {
      sides.push({ side: "front", url: productDetails.front_image });
    }
    if (productDetails?.back_image) {
      sides.push({ side: "back", url: productDetails.back_image });
    }
    if (productDetails?.left_image) {
      sides.push({ side: "left", url: productDetails.left_image });
    }
    if (productDetails?.right_image) {
      sides.push({ side: "right", url: productDetails.right_image });
    }
    return sides;
  };

  return (
    <nav className="bg-white fixed w-full top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center">
              <ShirtIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-2 sm:text-lg md:text-2xl font-bold text-gray-700 hover:text-gray-900 transition-colors duration-200">
                {store?.name}
              </h1>
            </div>
          </Link>

          {!isVendorMode && (
            <div className="md:hidden">
              <button
                onClick={handleMobileMenuToggle}
                className="mobile-menu-button p-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                {isMobileMenuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isVendorMode && !email && (
              <Link
                href="./auth"
                className="mx-3 px-4 py-2 text-sm font-medium text-white rounded-md text-left bg-purple-700 hover:bg-purple-500 transition-colors duration-200 flex items-center space-x-2"
                onClick={closeAllMenus}
              >
                <FaUserCircle className="text-xl text-white" />
                <span>LogIn / SignUp</span>
              </Link>
            )}

            {!isVendorMode && email && (
              <div className="relative profile-dropdown">
                <button
                  onClick={handleDesktopProfileClick}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={profile || "/images/profile-sample.jpg"}
                      alt="Profile Picture"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 truncate max-w-[150px]">
                    {username || email}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-1">
                    <button
                      onClick={() => router.push("/profile")}
                      className="w-full px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out text-left flex items-center space-x-2"
                    >
                      <FaCog className="text-xl text-gray-700 w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleDesktopLogout}
                      className="w-full px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out text-left flex items-center space-x-2"
                    >
                      <FaSignOutAlt className="text-xl text-gray-700" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {customerToken && (
              <div className="flex items-center space-x-4">
                {/* Wishlist Icon */}
                <button
                  onClick={handleDesktopWishlistClick}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <FaHeart className="text-2xl text-pink-500" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Cart Icon */}
                <div className="relative cart-dropdown">
                  <button
                    onClick={handleDesktopCartClick}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <FaShoppingCart className="text-2xl text-gray-700" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </button>

                  {isCartOpen && (
                    <div className="absolute right-0 mt-3 w-[32rem] bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5">
                      <div className="p-4">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Cart Items
                          </h3>
                          {allCartItems.length > 0 && (
                            <span className="text-lg font-bold text-green-600">
                              ${cartTotal.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 max-h-[400px] overflow-y-auto">
                          {allCartItems.length > 0 ? (
                            <ul className="space-y-4">
                              {allCartItems.map((item) => {
                                const isDesignable = item.product_type === "designable";
                                const designItem = item as IDesignableCartItem;
                                const standardItem = item as IStandardCartItem;

                                const pricePerItem = isDesignable
                                  ? (designItem.designs?.length || 0) * 100
                                  : standardItem.price || 100;
                                const itemTotal = pricePerItem * item.quantity;

                                const standardSides = !isDesignable
                                  ? getStandardProductSides(standardItem.product_details)
                                  : [];
                                const mainDesignIndex = standardSides.length > 0 ? 0 : (designItem.designs?.length || 0) > 0 ? 0 : 0;
                                const currentDesign = isDesignable
                                  ? designItem.designs?.[mainDesignIndex]
                                  : null;
                                const currentStandardSide = !isDesignable
                                  ? standardSides[mainDesignIndex] || standardSides[0]
                                  : null;

                                return (
                                  <li
                                    key={item.id}
                                    className="rounded-lg transition duration-200"
                                  >
                                    <div className="p-3 hover:bg-gray-50">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-start space-x-3">
                                          {/* Thumbnail Preview */}
                                          <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
                                            {isDesignable && currentDesign ? (
                                              <>
                                                <div className="absolute inset-0">
                                                  <Image
                                                    src={
                                                      currentDesign.apparel?.url ||
                                                      "/placeholder.svg"
                                                    }
                                                    alt={`Side: ${currentDesign.apparel.side}`}
                                                    fill
                                                    sizes="100%"
                                                    priority
                                                    className="rounded-none"
                                                    style={{
                                                      backgroundColor:
                                                        currentDesign.apparel?.color ||
                                                        "#ffffff",
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
                                                          ? "12px"
                                                          : currentDesign.apparel
                                                              .side ===
                                                            "rightshoulder"
                                                          ? "12px"
                                                          : "initial",
                                                      left:
                                                        currentDesign.apparel.side ===
                                                        "leftshoulder"
                                                          ? "-3px"
                                                          : currentDesign.apparel
                                                              .side ===
                                                            "rightshoulder"
                                                          ? "2px"
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
                                                      src={
                                                        currentDesign.pngImage ||
                                                        "/placeholder.svg"
                                                      }
                                                      alt={`Thumbnail`}
                                                      fill
                                                      sizes="100%"
                                                      className="rounded-md"
                                                      style={{
                                                        objectFit: "contain",
                                                      }}
                                                    />
                                                  </div>
                                                </div>
                                              </>
                                            ) : (
                                              <Image
                                                src={
                                                  currentStandardSide?.url ||
                                                  "/placeholder.svg"
                                                }
                                                alt={
                                                  standardItem.product_details?.title ||
                                                  "Standard Product"
                                                }
                                                fill
                                                sizes="100%"
                                                className="object-cover"
                                              />
                                            )}
                                          </div>
                                          <div>
                                            <p className="text-sm text-gray-600">
                                              Qty: {item.quantity}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                              {isDesignable
                                                ? `Designed Sides: ${getDesignedSidesText(designItem.designs || [])}`
                                                : `Size: ${standardItem.selected_size || "N/A"}, Color: ${
                                                    standardItem.selected_color
                                                      ? typeof standardItem.selected_color === "string"
                                                        ? standardItem.selected_color
                                                        : standardItem.selected_color || "N/A"
                                                      : "N/A"
                                                  }`}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                          <span className="text-sm font-semibold text-gray-900">
                                            ${itemTotal.toFixed(2)}
                                          </span>
                                          <button
                                            onClick={() =>
                                              handleDeleteCart(item.id)
                                            }
                                            className="text-red-500 hover:text-red-700 transition duration-200"
                                            title="Remove item"
                                          >
                                            <MdDeleteForever className="text-xl" />
                                          </button>
                                        </div>
                                      </div>

                                      <div
                                        className="cursor-pointer"
                                        onClick={() => toggleItemExpansion(item.id)}
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-sm text-gray-500">
                                            View all sides
                                          </span>
                                          <FaChevronDown
                                            className={`transform transition-transform ${
                                              expandedItems[item.id] ? "rotate-180" : ""
                                            }`}
                                          />
                                        </div>
                                      </div>

                                      {expandedItems[item.id] && (
                                        <div className="mt-2">
                                          <div className="grid grid-cols-3 gap-4">
                                            {isDesignable && designItem.designs ? (
                                              designItem.designs.map((design, index) => (
                                                <div
                                                  key={index}
                                                  className="flex flex-col items-center"
                                                >
                                                  <div className="relative w-24 h-28 mb-2">
                                                    <div className="absolute inset-0 border rounded-md">
                                                      <Image
                                                        src={
                                                          design.apparel?.url ||
                                                          "/placeholder.svg"
                                                        }
                                                        alt={`Side: ${design.apparel.side}`}
                                                        fill
                                                        sizes="100%"
                                                        priority
                                                        className="hover:cursor-pointer"
                                                        style={{
                                                          backgroundColor:
                                                            design.apparel?.color ||
                                                            "#ffffff",
                                                          objectFit: "cover",
                                                        }}
                                                      />
                                                    </div>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                      <div
                                                        className="relative translate-y-[-10%]"
                                                        style={{
                                                          top:
                                                            design.apparel.side ===
                                                            "leftshoulder"
                                                              ? "12px"
                                                              : design.apparel
                                                                  .side ===
                                                                "rightshoulder"
                                                              ? "12px"
                                                              : "initial",
                                                          left:
                                                            design.apparel.side ===
                                                            "leftshoulder"
                                                              ? "-3px"
                                                              : design.apparel
                                                                  .side ===
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
                                                          src={
                                                            design.pngImage ||
                                                            "/placeholder.svg"
                                                          }
                                                          alt={`Thumbnail ${
                                                            index + 1
                                                          }`}
                                                          fill
                                                          sizes="100%"
                                                          className="rounded-md"
                                                          style={{
                                                            objectFit: "contain",
                                                          }}
                                                          onClick={() =>
                                                            handleDesignClick(
                                                              designItem.designState,
                                                              designItem.propsState,
                                                              designItem.id
                                                            )
                                                          }
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <span className="text-xs text-gray-600">
                                                    Side: {capitalizeFirstLetter(design.apparel.side)}
                                                  </span>
                                                </div>
                                              ))
                                            ) : (
                                              standardSides.map((side, index) => (
                                                <div
                                                  key={index}
                                                  className="flex flex-col items-center"
                                                >
                                                  <div className="relative w-24 h-28 mb-2">
                                                    <Image
                                                      src={side.url || "/placeholder.svg"}
                                                      alt={`Side: ${side.side}`}
                                                      fill
                                                      sizes="100%"
                                                      className="object-cover rounded-md"
                                                    />
                                                  </div>
                                                  <span className="text-xs text-gray-600">
                                                    Side: {capitalizeFirstLetter(side.side)}
                                                  </span>
                                                </div>
                                              ))
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <p className="py-8 text-center text-gray-500">
                              Your cart is empty
                            </p>
                          )}
                        </div>

                        <button
                          onClick={handleViewCart}
                          className="mt-4 w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition duration-200 flex items-center justify-center space-x-2 shadow-md"
                        >
                          <span>View Cart</span>
                          {cartTotal > 0 && (
                            <span className="font-semibold">
                              (${cartTotal.toFixed(2)})
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="flex flex-col space-y-2">
                {!email ? (
                  <Link
                    href="./auth"
                    className="mx-3 px-4 py-2 text-sm font-medium text-gray-700 rounded-md text-left hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                    onClick={closeAllMenus}
                  >
                    <FaUserCircle className="text-xl text-gray-700" />
                    <span>LogIn / SignUp</span>
                  </Link>
                ) : (
                  <>
                    <div className="flex items-center space-x-2 mx-3 px-4 py-2 text-sm text-gray-700">
                      <FaUserCircle className="text-xl text-gray-700" />
                      <span className="truncate">{username || email}</span>
                    </div>

                    {customerToken && (
                      <>
                        <button
                          onClick={handleMobileWishlistClick}
                          className="flex items-center space-x-2 mx-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                          <FaHeart className="text-xl text-pink-500" />
                          <span className="text-sm text-gray-700">
                            Wishlist ({wishlistCount})
                          </span>
                        </button>

                        <button
                          onClick={handleMobileCartClick}
                          className="flex items-center space-x-2 mx-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                          <FaShoppingCart className="text-xl text-gray-700" />
                          <span className="text-sm text-gray-700">
                            Cart ({cartItemsCount})
                          </span>
                        </button>

                        <button
                          onClick={handleMobileLogout}
                          className="flex items-center space-x-2 mx-3 px-4 py-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                          <FaSignOutAlt className="text-xl text-gray-700" />
                          <span className="text-sm text-gray-700">Logout</span>
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;