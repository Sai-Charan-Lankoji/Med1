"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaHeart, FaShoppingCart, FaTimes } from "react-icons/fa";
import { Minus, Plus } from "lucide-react";
import { useNewCart } from "../hooks/useNewCart";
import { toast } from "react-toastify";
import Link from "next/link";
import Cookies from "js-cookie";
import { IDesign } from "@/@types/models";

interface Color {
  hex: string;
  name: string;
}

interface WishlistItem {
  id: string;
  customer_id: string;
  product_id: string | null;
  standard_product_id: string | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
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
  designs: {
    apparel: {
      side: string;
      url: string;
      color: string;
      width: number;
      height: number;
      selected: boolean;
    };
    id: number;
    items: any[];
    isactive: boolean;
    pngImage: string;
    svgImage: string | null;
    uploadedImages: string[];
    active: boolean;
  }[];
  quantity?: number;
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

interface DesignableProduct {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  customizable: boolean;
  colors: Color[];
  store_id: string;
  vendor_id: string;
  designs: {
    apparel: {
      side: string;
      url: string;
      color: string;
      width: number;
      height: number;
      selected: boolean;
    };
    id: number;
    items: any[];
    isactive: boolean;
    pngImage: string;
    svgImage: string | null;
    uploadedImages: string[];
    active: boolean;
  }[];
  propstate: {
    fill: string;
    underline: boolean;
    overline: boolean;
    backgroundColor: string;
    borderColor: string;
    fontSize: number;
    lineHeight: number;
    charSpacing: number;
    fontWeight: string;
    fontStyle: string;
    textAlign: string;
    fontFamily: string;
    textDecoration: string;
    drawMode: boolean;
    linethrough: boolean;
    bgColor: string;
    fillcolor: string;
    designId: number;
  };
  title: string;
  sku: string | null;
  description: string | null;
  product_type: string | null;
  sale: boolean | null;
  category: string | null;
  price: number;
  quantity: number;
  discount: number;
  stock: number;
  width: number | null;
  brand: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  metadata: string | null;
  collection_id: string | null;
  type_id: string | null;
  status: string | null;
  external_id: string | null;
  discountable: boolean | null;
  front_image: string;
  sizes: string[] | null;
}

interface StandardProductApiResponse {
  success: boolean;
  product: StandardProduct;
}

interface ProductSelections {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  activeDesignIndex: number;
}
interface DesignableProductApiResponse {
  success: boolean;
  product: DesignableProduct;
}

interface WishlistApiResponse {
  status: number;
  success: boolean;
  message: string;
  data?: WishlistItem[] | null;
  error?: { code: string; details: string };
}

const WISHLIST_API_URL = "http://localhost:5000/api/wishlists";
const STANDARD_PRODUCT_API_URL = "http://localhost:5000/api/standardproducts";
const DESIGNABLE_PRODUCT_API_URL = "http://localhost:5000/api/products";

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
  const [products, setProducts] = useState<(StandardProduct | DesignableProduct)[]>([]);
  const [sortedProducts, setSortedProducts] = useState<(StandardProduct | DesignableProduct)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productSelections, setProductSelections] = useState<
    Record<string, ProductSelections>
  >({});

  const router = useRouter();
  const { addStandardProductToCart, addDesignToCart } = useNewCart();

  // Fetch wishlist items
  const fetchWishlist = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(WISHLIST_API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch wishlist: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        setWishlistItems(data.data);
      } else {
        throw new Error("Invalid wishlist data structure");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching wishlist"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch standard product
  const fetchStandardProduct = useCallback(
    async (id: string): Promise<StandardProduct | null> => {
      try {
        const response = await fetch(`${STANDARD_PRODUCT_API_URL}/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.success && data.product) {
          const product = data.product as StandardProduct;
          product.customizable = false;
          return product;
        }
        return null;
      } catch (err) {
        console.error(`Error fetching standard product ${id}:`, err);
        return null;
      }
    },
    []
  );

  // Fetch designable product
  const fetchDesignableProduct = useCallback(
    async (id: string): Promise<DesignableProduct | null> => {
      try {
        const response = await fetch(`${DESIGNABLE_PRODUCT_API_URL}/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.success && data.product) {
          const product = data.product as DesignableProduct;
          product.customizable = true;
          product.colors = product.colors || DEFAULT_COLORS;
          product.sizes = product.sizes || ["S", "M", "L", "XL", "2XL"];
          product.stock = product.stock ?? 10;
          product.quantity = product.quantity ?? 1;
          return product;
        }
        return null;
      } catch (err) {
        console.error(`Error fetching designable product ${id}:`, err);
        return null;
      }
    },
    []
  );

  // Fetch all products
  const fetchAllProducts = useCallback(async (): Promise<void> => {
    if (!wishlistItems.length) {
      setProducts([]);
      setSortedProducts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const productPromises = wishlistItems.map((item) =>
        item.standard_product_id
          ? fetchStandardProduct(item.standard_product_id)
          : item.product_id
          ? fetchDesignableProduct(item.product_id)
          : null
      );
      const results = await Promise.all(productPromises);
      const validProducts = results.filter(
        (p): p is StandardProduct | DesignableProduct => p !== null
      );
      setProducts(validProducts);
      const designable = validProducts.filter((p) => p.customizable);
      const standard = validProducts.filter((p) => !p.customizable);
      setSortedProducts([...designable, ...standard]);

      const initialSelections = validProducts.reduce((acc, product) => {
        const colorsToUse = product.colors || DEFAULT_COLORS;
        acc[product.id] = {
          quantity: product.quantity || 1,
          selectedSize: product.sizes?.[0] || "",
          selectedColor: colorsToUse[0]?.hex || "",
          activeDesignIndex: 0,
        };
        return acc;
      }, {} as Record<string, ProductSelections>);
      setProductSelections(initialSelections);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching products"
      );
    } finally {
      setIsLoading(false);
    }
  }, [wishlistItems, fetchStandardProduct, fetchDesignableProduct]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  useEffect(() => {
    fetchAllProducts();
  }, [wishlistItems, fetchAllProducts]);

  // Handler functions
  const handleQuantityChange = (productId: string, change: number): void => {
    setProductSelections((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Math.max(1, prev[productId].quantity + change),
      },
    }));
  };

  const handleSizeChange = (productId: string, size: string): void => {
    setProductSelections((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], selectedSize: size },
    }));
  };

  const handleColorChange = (productId: string, color: string): void => {
    setProductSelections((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], selectedColor: color },
    }));
  };

  const handleDesignChange = (productId: string, index: number): void => {
    setProductSelections((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], activeDesignIndex: index },
    }));
  };

  const handleAddToCart = async (
    product: StandardProduct | DesignableProduct
  ): Promise<void> => {
    const selections = productSelections[product.id];
    if (!selections) {
      toast.error("Product selections not found.");
      return;
    }

    const { quantity, selectedSize, selectedColor } = selections;
    const colorsToUse = product.colors || DEFAULT_COLORS;
    const colorObj = colorsToUse.find((c) => c.hex === selectedColor) || {
      hex: selectedColor,
      name: "",
    };

    setIsLoading(true);
    try {
      let cartSuccess = false;

      if (product.customizable) {
        const designableProduct = product as DesignableProduct;
        const designs = designableProduct.designs || [];
        cartSuccess = await addDesignToCart(designs, [], {}, product.id);
        if (!cartSuccess) {
          throw new Error("Failed to add designable product to cart");
        }
      } else {
        cartSuccess = await addStandardProductToCart(
          product.id,
          quantity,
          selectedSize,
          colorObj.hex
        );
        if (!cartSuccess) {
          throw new Error("Failed to add standard product to cart");
        }
      }

      // If cart addition is successful, remove from wishlist
      toast.success("Added to cart successfully!");
      await handleRemoveFromWishlist(product.id, product.customizable);

    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred while adding to cart"
      );
      console.error("Error adding to cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (
    productId: string,
    isDesignable: boolean
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const requestBody = isDesignable
        ? { product_id: productId, standard_product_id: null }
        : { product_id: null, standard_product_id: productId };

      const response = await fetch(`${WISHLIST_API_URL}/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to remove from wishlist: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.status === 200 && data.success) {
        setWishlistItems((prev) =>
          prev.filter((item) =>
            isDesignable
              ? item.product_id !== productId
              : item.standard_product_id !== productId
          )
        );
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        setSortedProducts((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Removed from wishlist successfully!");
      } else {
        throw new Error(data.message || "Failed to remove from wishlist");
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred while removing from wishlist"
      );
      console.error("Error removing from wishlist:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (): void => {
    router.push("/");
  };

  const getDesignedSidesText = (
    designs: { apparel: { side: string } }[]
  ): string => {
    if (!designs || designs.length === 0) return "";
    const sides = designs.map((design) => design.apparel.side);
    if (sides.length === 1) return sides[0];
    if (sides.length === 2) return `${sides[0]} & ${sides[1]}`;
    const lastSide = sides.pop();
    return `${sides.join(", ")} & ${lastSide}`;
  };

  const designableProducts = sortedProducts.filter((product) => product.customizable);
  const standardProducts = sortedProducts.filter((product) => !product.customizable);

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

        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaHeart className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-600 font-medium">
              Your wishlist is empty or products failed to load.
            </p>
             
            <button
              onClick={() => router.push("/")}
              className="mt-6 inline-block px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Designable Products Section */}
            {designableProducts.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Designable Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {designableProducts.map((product) => {
                    const selections = productSelections[product.id] || {
                      quantity: product.quantity || 1,
                      selectedSize: product.sizes?.[0] || "",
                      selectedColor: product.colors?.[0]?.hex || DEFAULT_COLORS[0].hex,
                      activeDesignIndex: 0,
                    };
                    const currentDesign = product.designs?.[selections.activeDesignIndex];
                    const discountedPrice =
                      product.discount && product.discount > 0
                        ? product.price * (1 - (product.discount || 0) / 100)
                        : null;
                    const colorsToUse = product.colors || DEFAULT_COLORS;
                    const sizesToUse = product.sizes || ["S", "M", "L", "XL", "2XL"];

                    return (
                      <div
                        key={product.id}
                        className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      >
                        <div className="relative w-full h-56">
                          {currentDesign ? (
                            <>
                              <div className="absolute inset-0">
                                <Image
                                  src={currentDesign.apparel?.url || "/placeholder.svg"}
                                  alt={`Side: ${currentDesign.apparel?.side || "Design"}`}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  priority
                                  className="rounded-none"
                                  style={{
                                    backgroundColor: selections.selectedColor,
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                  className="relative translate-y-[-10%]"
                                  style={{
                                    top:
                                      currentDesign.apparel?.side === "leftshoulder"
                                        ? "35px"
                                        : currentDesign.apparel?.side === "rightshoulder"
                                        ? "30px"
                                        : "initial",
                                    left:
                                      currentDesign.apparel?.side === "leftshoulder"
                                        ? "-10px"
                                        : currentDesign.apparel?.side === "rightshoulder"
                                        ? "8px"
                                        : "initial",
                                    width:
                                      currentDesign.apparel?.side === "leftshoulder" ||
                                      currentDesign.apparel?.side === "rightshoulder"
                                        ? "30%"
                                        : "50%",
                                    height:
                                      currentDesign.apparel?.side === "leftshoulder" ||
                                      currentDesign.apparel?.side === "rightshoulder"
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
                            <Image
                              src="/placeholder.svg"
                              alt={product.title || "Designable Product"}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                              style={{ backgroundColor: selections.selectedColor }}
                            />
                          )}
                          <span
                            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                              product.stock && product.stock > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock && product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>

                        {product.designs && product.designs.length > 1 && (
                          <div className="mt-4 grid grid-cols-4 gap-6 px-4">
                            {product.designs.map((design, index) => (
                              <div
                                key={index}
                                className={`relative w-16 h-20 cursor-pointer transition-all duration-200 ${
                                  index === selections.activeDesignIndex
                                    ? "ring-2 ring-gray-700"
                                    : "hover:ring-2 hover:ring-gray-300"
                                }`}
                                onClick={() => handleDesignChange(product.id, index)}
                              >
                                <div className="absolute inset-0">
                                  <Image
                                    src={design.apparel?.url || "/placeholder.svg"}
                                    alt={`Side: ${design.apparel?.side}`}
                                    fill
                                    sizes="100%"
                                    priority
                                    className="rounded-none"
                                    style={{
                                      backgroundColor: selections.selectedColor,
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div
                                    className="relative translate-y-[-10%]"
                                    style={{
                                      top:
                                        design.apparel?.side === "leftshoulder"
                                          ? "12px"
                                          : design.apparel?.side === "rightshoulder"
                                          ? "12px"
                                          : "initial",
                                      left:
                                        design.apparel?.side === "leftshoulder"
                                          ? "-3px"
                                          : design.apparel?.side === "rightshoulder"
                                          ? "2px"
                                          : "initial",
                                      width:
                                        design.apparel?.side === "leftshoulder" ||
                                        design.apparel?.side === "rightshoulder"
                                          ? "30%"
                                          : "50%",
                                      height:
                                        design.apparel?.side === "leftshoulder" ||
                                        design.apparel?.side === "rightshoulder"
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
                            ))}
                          </div>
                        )}

                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {product.title || "Untitled Designable Product"}
                          </h3>
                          <p className="text-sm text-gray-500 font-medium mb-2">
                            {product.brand || "Custom Brand"}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Designed Sides:</span>{" "}
                            {getDesignedSidesText(product.designs || [])}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {product.description || "No description available"}
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
                                  {product.discount || 0}% OFF
                                </span>
                              </>
                            ) : (
                              <p className="text-lg font-bold text-gray-800">
                                ${product.price.toFixed(2)}
                              </p>
                            )}
                          </div>

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
                                  onClick={() => handleColorChange(product.id, color.hex)}
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

                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.stock || product.stock === 0 || isLoading}
                              className={`flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-medium transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                                !product.stock || product.stock === 0 || isLoading
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:from-green-600 hover:to-green-700 hover:shadow-lg"
                              }`}
                            >
                              <FaShoppingCart className="inline mr-2" />
                              <span className="hidden lg:inline">
                                {isLoading ? "Adding..." : "Add to Cart"}
                              </span>
                            </button>
                            <button
                              onClick={() => handleRemoveFromWishlist(product.id, true)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium transition-all duration-300 shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                              disabled={isLoading}
                            >
                              <FaHeart className="inline mr-2" />
                              <span className="hidden lg:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-lg text-gray-600 font-medium">
                  No Designable Products in your wishlist.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Fetched designable products: {JSON.stringify(designableProducts)}
                </p>
              </div>
            )}

            {/* Standard Products Section */}
            {standardProducts.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Standard Products
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {standardProducts.map((product) => {
                    const discountedPrice =
                      product.discount && product.discount > 0
                        ? product.price * (1 - product.discount / 100)
                        : null;
                    const selections = productSelections[product.id] || {
                      quantity: product.quantity || 1,
                      selectedSize: product.sizes?.[0] || "",
                      selectedColor: product.colors?.[0]?.hex || DEFAULT_COLORS[0].hex,
                      activeDesignIndex: 0,
                    };
                    const colorsToUse = product.colors || DEFAULT_COLORS;
                    const sizesToUse = product.sizes || ["S", "M", "L", "XL", "2XL"];

                    return (
                      <div
                        key={product.id}
                        className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      >
                        <div className="relative w-full h-56">
                          <Image
                            src={product.front_image || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-opacity duration-300 hover:opacity-90"
                            priority
                          />
                          <span
                            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                              product.stock && product.stock > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock && product.stock > 0 ? "In Stock" : "Out of Stock"}
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
                                  onClick={() => handleColorChange(product.id, color.hex)}
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

                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!product.stock || product.stock === 0 || isLoading}
                              className={`flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-medium transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                                !product.stock || product.stock === 0 || isLoading
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:from-green-600 hover:to-green-700 hover:shadow-lg"
                              }`}
                            >
                              <FaShoppingCart className="inline mr-2" />
                              <span className="hidden lg:inline">
                                {isLoading ? "Adding..." : "Add to Cart"}
                              </span>
                            </button>
                            <button
                              onClick={() => handleRemoveFromWishlist(product.id, false)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium transition-all duration-300 shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                              disabled={isLoading}
                            >
                              <FaHeart className="inline mr-2" />
                              <span className="hidden lg:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-lg text-gray-600 font-medium">
                  No Standard Products in your wishlist.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Fetched standard products: {JSON.stringify(standardProducts)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
