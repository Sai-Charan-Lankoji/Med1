"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaHeart, FaShoppingCart, FaTimes } from "react-icons/fa";
import { Minus, Plus } from "lucide-react"; // Import icons for quantity controls
import { useNewCart } from "../hooks/useNewCart";
import { toast } from "react-toastify";
import Link from "next/link";

interface Color {
  hex: string;
  name: string;
}

interface WishlistItem {
  id: string;
  customer_id: string;
  product_id: string | null;
  standard_product_id: string | null;
}

interface StandardProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: Color[];
  stock: number;
  brand: string;
  sku: string;
  discount: number;
  customizable: boolean;
  sale: boolean;
  front_image: string;
  back_image?: string;
  left_image?: string;
  right_image?: string;
  product_type: string;
  store_id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  product: StandardProduct[] | null;
  data: WishlistItem[] | null;
  error?: { code: string; details: string };
}

const WISHLIST_API_URL = "http://localhost:5000/api/wishlists";
const STANDARD_PRODUCT_API_URL = "http://localhost:5000/api/standardproducts";

// Default colors if none are provided for a customizable product
const DEFAULT_COLORS: Color[] = [
  { hex: "#FFFFFF", name: "White" },
  { hex: "#000000", name: "Black" },
  { hex: "#FF0000", name: "Red" },
  { hex: "#00FF00", name: "Green" },
  { hex: "#0000FF", name: "Blue" },
  { hex: "#FFFF00", name: "Yellow" },
  { hex: "#800080", name: "Purple" },
  { hex: "#FFA500", name: "Orange" },
  { hex: "#FFC0CB", name: "Pink" },
  { hex: "#A52A2A", name: "Brown" },
  { hex: "#808080", name: "Gray" },
];

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [products, setProducts] = useState<StandardProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // Manage selections for each product
  const [productSelections, setProductSelections] = useState<
    Record<
      string,
      { quantity: number; selectedSize: string; selectedColor: string }
    >
  >({});
  const router = useRouter();
  const { addStandardProductToCart, addDesignToCart } = useNewCart();

  useEffect(() => {
    const authToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem("auth_token")
        : null;
    setToken(authToken);
  }, []);

  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setError("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(WISHLIST_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = (await response.json()) as ApiResponse;
      if (data.status === 200 && data.success && data.data) {
        setWishlistItems(data.data as WishlistItem[]);
      } else {
        setError(data.message || "Failed to fetch wishlist");
        console.warn("Wishlist fetch warning:", data.message);
      }
    } catch (err) {
      setError(
        (err as Error).message || "An error occurred while fetching wishlist"
      );
      console.error("Wishlist fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchProductDetails = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`${STANDARD_PRODUCT_API_URL}/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = (await response.json()) as ApiResponse;
        console.log(`Product Details for ID ${id}:`, data.product);
        if (data.success && data.product) {
          setProducts(data.product);
          return data.product as unknown as StandardProduct;
        }
        console.warn(
          `Failed to fetch product details for ID ${id}:`,
          data.message
        );
        return null;
      } catch (err) {
        console.error(`Error fetching product details for ID ${id}:`, err);
        return null;
      }
    },
    [token]
  );

  useEffect(() => {
    if (token !== null) {
      fetchWishlist();
    }
  }, [token, fetchWishlist]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setIsLoading(true);
      const productPromises = wishlistItems.map((item) =>
        item.standard_product_id
          ? fetchProductDetails(item.standard_product_id)
          : Promise.resolve(null)
      );
      const results = await Promise.all(productPromises);
      const validProducts = results.filter(
        (product): product is StandardProduct => product !== null
      );
      setProducts(validProducts);

      // Initialize selections for each product
      const initialSelections: Record<
        string,
        { quantity: number; selectedSize: string; selectedColor: string }
      > = {};
      validProducts.forEach((product) => {
        const colorsToUse =
          product.customizable &&
          (!product.colors || product.colors.length === 0)
            ? DEFAULT_COLORS
            : product.colors || [];
        initialSelections[product.id] = {
          quantity: 1,
          selectedSize:
            product.sizes && product.sizes.length > 0 ? product.sizes[0] : "",
          selectedColor: colorsToUse.length > 0 ? colorsToUse[0].hex : "",
        };
      });
      setProductSelections(initialSelections);
      setIsLoading(false);
    };
    if (wishlistItems.length > 0) {
      fetchAllProducts();
    } else {
      setProducts([]);
      setIsLoading(false);
    }
  }, [wishlistItems, fetchProductDetails]);

  const handleQuantityChange = (productId: string, change: number) => {
    setProductSelections((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Math.max(1, prev[productId].quantity + change),
      },
    }));
  };

  const handleSizeChange = (productId: string, size: string) => {
    setProductSelections((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        selectedSize: size,
      },
    }));
  };

  const handleColorChange = (productId: string, colorHex: string) => {
    setProductSelections((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        selectedColor: colorHex,
      },
    }));
  };

  const handleAddToCart = async (product: StandardProduct) => {
    const selections = productSelections[product.id];
    if (!selections) return;

    const { quantity, selectedSize, selectedColor } = selections;
    const colorsToUse =
      product.customizable && (!product.colors || product.colors.length === 0)
        ? DEFAULT_COLORS
        : product.colors || [];

    setIsLoading(true);
    try {
      // Handle standard products
      const colorObj = colorsToUse.find((c) => c.hex === selectedColor) || {
        hex: selectedColor,
        name: "",
      };

      console.log("Adding standard product:", {
        productId: product.id,
        quantity,
        selectedSize,
        selectedColor: colorObj.hex,
      });

      const success = await addStandardProductToCart(
        product.id,
        quantity,
        selectedSize,
        colorObj.hex
      );
      if (!success) throw new Error("Failed to add standard product to cart");

      toast.success("Added to cart successfully!");
      await handleRemoveFromWishlist(product.id);
    } catch (err) {
      toast.error("An error occurred while adding to cart");
      console.error("Failed to add to cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${WISHLIST_API_URL}/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ standard_product_id: productId }),
      });
      const data = (await response.json()) as ApiResponse;
      if (data.status === 200 && data.success) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.standard_product_id !== productId)
        );
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Removed from wishlist!");
        fetchWishlist();
      } else {
        toast.error(data.message || "Failed to remove from wishlist");
      }
    } catch (err) {
      setError(
        (err as Error).message ||
          "An error occurred while removing from wishlist"
      );
      toast.error("Failed to remove from wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="sticky top-0 z-10 bg-white shadow-md rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-10 flex-1 bg-gray-200 rounded"></div>
                  <div className="h-10 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
          <button
            onClick={fetchWishlist}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="sticky top-0 mt-16 z-10 bg-white shadow-md rounded-lg p-4 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            My Wishlist
          </h1>
          <button
            onClick={handleClose}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 rounded-full hover:from-gray-300 hover:to-gray-400 transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            <FaTimes className="text-lg" />
            <span className="hidden sm:inline font-medium">Close</span>
          </button>
        </div>

        {products?.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaHeart className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-600 font-medium">
              Your wishlist is empty.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Start adding products you love to see them here!
            </p>
            <Link
              href="/"
              className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => {
              const discountedPrice =
                product.discount > 0
                  ? product.price * (1 - product.discount / 100)
                  : null;
              const selections = productSelections[product.id] || {
                quantity: 1,
                selectedSize:
                  product.sizes && product.sizes.length > 0
                    ? product.sizes[0]
                    : "",
                selectedColor:
                  product.colors && product.colors.length > 0
                    ? product.colors[0].hex
                    : "",
              };
              const colorsToUse =
                product.customizable &&
                (!product.colors || product.colors.length === 0)
                  ? DEFAULT_COLORS
                  : product.colors || [];
              const defaultSizes = ["S", "M", "L", "XL", "2XL"];
              const sizesToUse =
                product.sizes && product.sizes.length > 0
                  ? product.sizes
                  : defaultSizes;

              return (
                <div
                  key={product.id}
                  className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="relative w-full h-56">
                    <Image
                      src={product.front_image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-opacity duration-300 hover:opacity-90"
                      priority
                    />
                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mb-2">
                      {product.brand}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center mb-3">
                      {discountedPrice ? (
                        <>
                          <p className="text-lg font-bold text-indigo-600 mr-2">
                            ${discountedPrice.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </p>
                          <span className="ml-2 text-xs font-semibold text-green-600">
                            {product.discount}% OFF
                          </span>
                        </>
                      ) : (
                        <p className="text-lg font-bold text-gray-800">
                          ${product.price.toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Sizes Selection */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Sizes:</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {sizesToUse.map((size) => (
                          <button
                            key={size}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                              selections.selectedSize === size
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                            onClick={() => handleSizeChange(product.id, size)}
                            disabled={isLoading}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colors Selection */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Colors:</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {colorsToUse.map((color) => (
                          <button
                            key={color.hex}
                            className={`w-6 h-6 rounded-full border transition-transform duration-200 hover:scale-110 group ${
                              selections.selectedColor === color.hex
                                ? "ring-2 ring-offset-2 ring-indigo-600 scale-110"
                                : "ring-1 ring-gray-200"
                            }`}
                            style={{ backgroundColor: color.hex }}
                            onClick={() =>
                              handleColorChange(product.id, color.hex)
                            }
                            title={color.name}
                            disabled={isLoading}
                          >
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {color.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center mb-4">
                      <button
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => handleQuantityChange(product.id, -1)}
                        disabled={isLoading}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-4 text-lg font-semibold text-gray-800">
                        {selections.quantity}
                      </span>
                      <button
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => handleQuantityChange(product.id, 1)}
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0 || isLoading}
                        className={`flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-medium transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                          product.stock === 0 || isLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:from-green-600 hover:to-green-700 hover:shadow-lg"
                        }`}
                      >
                        <FaShoppingCart className="inline mr-2" />
                        {isLoading ? "Adding..." : "Add to Cart"}
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium transition-all duration-300 shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        disabled={isLoading}
                      >
                        <FaHeart className="inline mr-2" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
