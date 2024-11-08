"use client";
import React, { useState, useEffect } from "react";
import { FaUserCircle, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
//import { useCart } from "@/context/cartContext";
import { MdDeleteForever } from "react-icons/md";
import { useUserContext } from "@/context/userContext";
import { useCustomerLogout } from "../hooks/useCustomerLogout";
import { useRouter } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import { DesignContext } from "@/context/designcontext";
import { useNewCart } from "../hooks/useNewCart";
import { IDesign, IProps } from "@/@types/models";
import { useDesignSwitcher } from "../hooks/useDesignSwitcher";

const Navbar: React.FC = () => {
  const { cartItems, deleteCart } = useNewCart();
   const { email, customerToken } = useUserContext();
  const [username, setUsername] = useState<string>(""); 
  const { logout } = useCustomerLogout();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  // Added: Effect to get username from sessionStorage
  useEffect(() => {
    if (email) {
      const storedUsername = sessionStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [email]);

  useEffect(() => {
    if (customerToken) {
      //const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalItems = cartItems.length;
      setCartItemsCount(totalItems);
      const total = cartItems.reduce((sum, item) => {
        // Calculate price based on number of sides
        const numberOfSides = item.designs ? item.designs.length : 1;
        return sum + 100 * numberOfSides * item.quantity; // $100 per side
      }, 0);
      setCartTotal(total);
    } else {
      setCartItemsCount(0);
      setCartTotal(0);
    }
  }, [cartItems, customerToken]);

  const designContext = React.useContext(DesignContext)
  const { designs, dispatchDesign } = designContext || { designs: [], dispatchDesign: () => {} }
  
  // ... other state and hooks

  const { switchToDesign } = useDesignSwitcher();
  
  const handleDesignClick = async (designState: IDesign, propsState: IProps, id: any) => {
    console.log("Design clicked", designState); 
    localStorage.setItem("savedDesignState", JSON.stringify(designState));
    localStorage.setItem("savedPropsState", JSON.stringify(propsState));
    localStorage.setItem('cart_id', id);
    dispatchDesign({ type: "SWITCH_DESIGN", currentDesign: designState });

    const success = await switchToDesign(designState);
    
    if (success) {
      setIsCartOpen(false);
      // Force a small delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      // Optionally scroll to the canvas area
      const canvasElement = document.querySelector('.canvas-container');
      if (canvasElement) {
        canvasElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  
  // Toggle item expansion
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
      // Only clear local cart state after successful API call
      console.log("Cart item deleted successfully");
    } else {
      console.log("Failed to delete cart item");
    }
  };

  // Desktop handlers
  const handleDesktopCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!customerToken) {
      router.push("/auth");
      closeAllMenus();
    } else {
      setIsCartOpen((prev) => !prev);
      console.log("cartItems", cartItems);

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

  // Mobile handlers
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
    if (!customerToken) {
      router.push("/auth");
    } else {
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
  return (
    <nav className="bg-white fixed w-full top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="sm:text-lg md:text-2xl font-bold text-gray-700 hover:text-gray-900 transition-colors duration-200">
              Customized Baseball Jersey Design
            </h1>
          </Link>

          {/* Mobile menu button */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!email && (
              <Link
                href="./auth"
                className="mx-3 px-4 py-2 text-sm font-medium text-gray-800 rounded-md text-left bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                onClick={closeAllMenus}
              >
                <FaUserCircle className="text-xl text-gray-800" />
                <span>LogIn / SignUp</span>
              </Link>
            )}

            {email && (
              <div className="relative profile-dropdown">
                <button
                  onClick={handleDesktopProfileClick}
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                >
                  <FaUserCircle className="text-2xl text-gray-700" />
                  {/* Original email display */}
                  {/* <span className="hidden md:block text-sm font-medium text-gray-700 truncate max-w-[150px]">
                    {email}
                  </span> */}
                  {/* Modified to show username */}
                  <span className="hidden md:block text-sm font-medium text-gray-700 truncate max-w-[150px]">
                    {username || email}{" "}
                    {/* Fallback to email if username is not available */}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-1">
                    <button
                      onClick={handleDesktopLogout}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out text-left flex items-center space-x-2"
                    >
                      <FaSignOutAlt className="text-xl text-gray-700" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {customerToken && (
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
                        {cartItems.length > 0 && (
                          <span className="text-lg font-bold text-green-600">
                            ${cartTotal.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 max-h-[400px] overflow-y-auto">
                        {cartItems.length > 0 ? (
                          <ul className="space-y-4">
                            {cartItems?.map((item, index) => (
                              <li
                                key={index}
                                className="rounded-lg transition duration-200"
                              >
                                <div className="p-3 hover:bg-gray-50">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      {/* <p className="text-sm font-medium text-gray-900 truncate">
                              {item.title}
                            </p> */}
                                      <p className="text-sm text-gray-600">
                                        Qty: {item.quantity}
                                      </p>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Designed Sides:{" "}
                                        <span className="text-xs">
                                          {getDesignedSidesText(item.designs)}
                                        </span>
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      <span className="text-sm font-semibold text-gray-900">
                                        $
                                        {(
                                          (item.designs
                                            ? item.designs.length * 100
                                            : 100) * item.quantity
                                        ).toFixed(2)}
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
                                          expandedItems[item.id]
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                  </div>

                                  {expandedItems[item.id] && (
                                    <div className="mt-2">
                                      <div className="grid grid-cols-3 gap-4">
                                        {item.designs.map((design, index) => (
                                          <div
                                            key={index}
                                            className="flex flex-col items-center"
                                          >
                                            <div className="relative w-24 h-28 mb-2">
                                              <div className="absolute inset-0 border rounded-md">
                                                <Image
                                                  src={design.apparel?.url}
                                                  alt={`Side: ${design.apparel.side}`}
                                                  layout="fill"
                                                  objectFit="cover"
                                                  className="hover:cursor-pointer"
                                                  style={{
                                                    backgroundColor:
                                                      design.apparel?.color,
                                                  }}
                                                  
                                                />
                                              </div>
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative w-1/2 h-1/2 translate-y-[-10%]">
                                                  <Image
                                                    src={
                                                      design?.pngImage
                                                    }
                                                    alt={`Side ${
                                                      index + 1
                                                    } design`}
                                                    layout="fill"
                                                    objectFit="contain"
                                                    className="rounded-md"
                                                    onClick={() => handleDesignClick(item.designState,item.propsState, item.id)}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            <span className="text-xs text-gray-600">
                                              Side:{" "}
                                              {capitalizeFirstLetter(
                                                design.apparel.side
                                              )}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))}
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
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
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
                      {/* Original email display in mobile menu */}
                      {/* <span className="truncate">{email}</span> */}
                      {/* Modified to show username in mobile menu */}
                      <span className="truncate">{username || email}</span>
                    </div>

                    {customerToken && (
                      <>
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
