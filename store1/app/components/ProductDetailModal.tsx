import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { X, Minus, Plus, ShoppingCart, Pencil, Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useNewCart } from "../hooks/useNewCart";
import { IDesign } from "@/@types/models";
import { getHexFromColorName } from "../utils/colorUtils";

interface Color {
  hex: string;
  name: string;
}

interface Variant {
  variantId: string;
  size: string;
  color: string;
  availableQuantity: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  brand: string;
  front_image: string;
  back_image?: string;
  left_image?: string;
  right_image?: string;
  category: string;
  sku: string;
  customizable?: boolean;
  designstate?: IDesign[];
  propstate?: any;
  designs?: IDesign[];
  stock_id?: string;
  stock?: { StockVariants: Variant[] };
}

interface WishlistItem {
  id: string;
  customer_id: string;
  product_id: string | null;
  standard_product_id: string | null;
}

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

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

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState(product.front_image);
  const [currentSide, setCurrentSide] = useState("front");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<Color[]>([]);

  const router = useRouter();
  const {
    addDesignToCart,
    addStandardProductToCart,
    loading: cartLoading,
  } = useNewCart();

  const defaultSizes = ["S", "M", "L", "XL", "2XL"];

  // Extract variants for standard products, use defaults for customizable
  useEffect(() => {
    if (product.customizable) {
      setAvailableSizes(defaultSizes);
      setAvailableColors(DEFAULT_COLORS);
      if (defaultSizes.length > 0) setSelectedSize(defaultSizes[0]);
      if (DEFAULT_COLORS.length > 0) setSelectedColor(DEFAULT_COLORS[0].hex);
    } else {
      const fetchedVariants = product.stock?.StockVariants || [];
      setVariants(fetchedVariants);

      const sizes = [...new Set(fetchedVariants.map((v: Variant) => v.size))];
      const colors = [
        ...new Set(
          fetchedVariants
            .filter((v: Variant) => v.color)
            .map((v: Variant) => v.color)
        ),
      ].map((color: string) => ({
        hex: getHexFromColorName(color),
        name: color,
      }));

      setAvailableSizes(sizes);
      setAvailableColors(colors);

      if (sizes.length > 0) setSelectedSize(sizes[0]);
      if (colors.length > 0) setSelectedColor(colors[0].hex);
    }
  }, [product.stock, product.customizable]);

  const getAvailableColorsForSize = (size: string) => {
    if (!size || product.customizable) return availableColors;
    const relevantVariants = variants.filter((v) => v.size === size && v.availableQuantity > 0);
    return availableColors.filter((color) =>
      relevantVariants.some((v) => v.color === color.name)
    );
  };

  const getAvailableSizesForColor = (color: string) => {
    if (!color || product.customizable) return availableSizes;
    const relevantVariants = variants.filter(
      (v) => v.color === (availableColors.find((c) => c.hex === color)?.name || color) && v.availableQuantity > 0
    );
    return availableSizes.filter((size) =>
      relevantVariants.some((v) => v.size === size)
    );
  };

  const colorsToUse = product.customizable ? DEFAULT_COLORS : getAvailableColorsForSize(selectedSize);
  const sizesToUse = product.customizable ? defaultSizes : getAvailableSizesForColor(selectedColor);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (product.customizable) {
        const designs = product.designs || [];
        const designState = product.designstate || [];
        const propState = product.propstate || {};

        console.log("Adding designable product:", {
          productId: product.id,
          designs,
          designState,
          propState,
        });

        const success = await addDesignToCart(
          designs,
          designState,
          propState,
          product.id
        );
        if (!success)
          throw new Error("Failed to add designable product to cart");
      } else {
        const colorObj = colorsToUse.find((c) => c.hex === selectedColor) || {
          hex: selectedColor,
          name: "",
        };

        console.log("Adding standard product:", {
          productId: product.id,
          quantity,
          selectedSize,
          selectedColor: colorObj.name,
        });

        const success = await addStandardProductToCart(
          product.id,
          quantity,
          selectedSize,
          colorObj.name
        );
        if (!success) throw new Error("Failed to add standard product to cart");
      }

      onClose();
    } catch (error: any) {
      setError(error.message || "Failed to add to cart");
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomize = () => {
    if (product.customizable && product.designstate && product.propstate) {
      localStorage.setItem(
        "savedDesignState",
        JSON.stringify(product.designstate)
      );
      localStorage.setItem(
        "savedPropsState",
        JSON.stringify(product.propstate)
      );
      localStorage.setItem("product_id", product.id);
      router.push("/dashboard");
    }
  };

  const getDesignForSide = (side: string) => {
    if (!product.designs || product.designs.length === 0) return null;
    const design = product.designs.find(
      (d) => d.apparel && d.apparel.side === side
    );
    return design;
  };

  const getImageUrlFromDesigns = (side: string) => {
    if (!product.designs || product.designs.length === 0) return null;
    const design = product.designs.find(
      (d) => d.apparel && d.apparel.side === side
    );
    return design?.apparel?.url || null;
  };

  const updateCurrentSide = (imgSrc: string) => {
    const matchingImage = images.find((img) => img.src === imgSrc);
    if (matchingImage) {
      setCurrentSide(matchingImage.side);
    }
  };

  const getImages = () => {
    const result: { src: string; alt: string; side: string }[] = [];

    if (product.front_image) {
      result.push({
        src: product.front_image,
        alt: "Front View",
        side: "front",
      });
    }
    if (product.back_image) {
      result.push({ src: product.back_image, alt: "Back View", side: "back" });
    }
    if (product.left_image) {
      result.push({
        src: product.left_image,
        alt: "Left View",
        side: "leftshoulder",
      });
    }
    if (product.right_image) {
      result.push({
        src: product.right_image,
        alt: "Right View",
        side: "rightshoulder",
      });
    }

    if (product.customizable && product.designs) {
      const sides = ["front", "back", "leftshoulder", "rightshoulder"];
      sides.forEach((side) => {
        if (!result.some((img) => img.side === side)) {
          const designImgUrl = getImageUrlFromDesigns(side);
          if (designImgUrl) {
            result.push({ src: designImgUrl, alt: `${side} View`, side: side });
          }
        }
      });
    }

    return result;
  };

  const images = getImages();

  const getPositionForSide = (side: string) => {
    switch (side) {
      case "leftshoulder":
        return { top: "60%", left: "45%", width: "30%", height: "30%" };
      case "rightshoulder":
        return { top: "60%", left: "55%", width: "30%", height: "30%" };
      case "front":
      case "back":
      default:
        return { top: "50%", left: "50%", width: "50%", height: "50%" };
    }
  };

  const fetchWishlist = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        setIsInWishlist(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/wishlists", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.status === 200 && data.success) {
        const wishlist = data.data as WishlistItem[];
        const isDesignable = product.customizable === true;
        const isPresent = wishlist.some(
          (item) =>
            (isDesignable && item.product_id === product.id) ||
            (!isDesignable && item.standard_product_id === product.id)
        );
        setIsInWishlist(isPresent);
      } else {
        setIsInWishlist(false);
        console.warn("Failed to fetch wishlist:", data.message);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setIsInWishlist(false);
    }
  }, [product.id, product.customizable]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleWishlistToggle = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        throw new Error("User not authenticated");
      }

      const isCurrentlyInWishlist = isInWishlist;
      setIsInWishlist(!isCurrentlyInWishlist);

      const endpoint = isCurrentlyInWishlist ? "/remove" : "/add";
      const isDesignable = product.customizable === true;
      const requestBody = isDesignable
        ? { product_id: product.id, standard_product_id: null }
        : { product_id: null, standard_product_id: product.id };

      const response = await fetch(`http://localhost:5000/api/wishlists${endpoint}`, {
        method: isCurrentlyInWishlist ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.status !== 200 && data.status !== 201) {
        setIsInWishlist(isCurrentlyInWishlist);
        throw new Error(data.message || "Failed to update wishlist");
      }

      await fetchWishlist();
    } catch (error: any) {
      setError(error.message || "Failed to update wishlist");
      console.error("Wishlist update error:", error);
      await fetchWishlist();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          <div className="md:w-1/2 bg-gray-50 p-8">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-6 shadow-lg ring-1 ring-gray-100">
              <Image
                src={mainImage || "/placeholder.svg"}
                alt={product.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
                style={{
                  backgroundColor: product.customizable
                    ? selectedColor
                    : undefined,
                }}
              />
              {product.customizable && product.designs && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {(() => {
                    const currentDesign = getDesignForSide(currentSide);
                    if (!currentDesign || !currentDesign.pngImage) return null;

                    const position = getPositionForSide(currentSide);

                    return (
                      <div
                        className="absolute flex items-center justify-center pointer-events-none"
                        style={{
                          top: position.top,
                          left: position.left,
                          width: position.width,
                          height: position.height,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Image
                          src={currentDesign.pngImage}
                          alt="Design"
                          layout="fill"
                          objectFit="contain"
                          className="rounded-md"
                        />
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 
                    ${
                      mainImage === img.src
                        ? "ring-2 ring-black shadow-lg scale-95"
                        : "hover:ring-2 hover:ring-gray-300 hover:shadow-md"
                    }`}
                  onClick={() => {
                    setMainImage(img.src!);
                    updateCurrentSide(img.src);
                  }}
                >
                  <Image
                    src={img.src || "/placeholder.svg"}
                    alt={img.alt}
                    layout="fill"
                    objectFit="cover"
                    style={{
                      backgroundColor: product.customizable
                        ? selectedColor
                        : undefined,
                    }}
                  />
                  {product.customizable && product.designs && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {(() => {
                        const design = getDesignForSide(img.side);
                        if (!design || !design.pngImage) return null;

                        const position = getPositionForSide(img.side);
                        const thumbnailPosition = {
                          top: position.top,
                          left: position.left,
                          width: position.width,
                          height: position.height,
                        };

                        return (
                          <div
                            className="absolute flex items-center justify-center pointer-events-none"
                            style={{
                              top: thumbnailPosition.top,
                              left: thumbnailPosition.left,
                              width: thumbnailPosition.width,
                              height: thumbnailPosition.height,
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <Image
                              src={design.pngImage}
                              alt={`Design ${img.side}`}
                              layout="fill"
                              objectFit="contain"
                              className="rounded-md"
                            />
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 p-8 flex flex-col bg-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-black mb-2">
                  {product.title || "Product Name"}
                </h2>
                <p className="text-2xl font-semibold text-black">
                  ${product.price || 100}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description || "Product description goes here."}
            </p>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="space-y-6 flex-grow">
              <div className="flex gap-6 text-sm text-gray-500">
                <div>
                  <span className="block font-medium text-black">Brand</span>
                  {product.brand || "Brand Name"}
                </div>
                <div>
                  <span className="block font-medium text-black">Category</span>
                  {product.category || "Clothing"}
                </div>
                <div>
                  <span className="block font-medium text-black">SKU</span>
                  {product.sku || "SKU001"}
                </div>
              </div>
              {(sizesToUse.length > 0) && (
                <div>
                  <h3 className="font-medium text-black mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                      const isAvailable = getAvailableSizesForColor(selectedColor).includes(size);
                      return (
                        <button
                          key={size}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${
                              selectedSize === size
                                ? "bg-black text-white shadow-md"
                                : isAvailable
                                ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable || isLoading}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {(colorsToUse.length > 0) && (
                <div>
                  <h3 className="font-medium text-black mb-3">Select Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color) => {
                      const isAvailable = getAvailableColorsForSize(selectedSize).some(
                        (c) => c.hex === color.hex
                      );
                      return (
                        <button
                          key={color.hex}
                          className={`w-10 h-10 rounded-full transition-transform duration-200 hover:scale-110
                            ${
                              selectedColor === color.hex
                                ? "ring-2 ring-offset-2 ring-black scale-110"
                                : isAvailable
                                ? "ring-1 ring-gray-200"
                                : "ring-1 ring-gray-200 opacity-50 cursor-not-allowed"
                            }`}
                          style={{ backgroundColor: color.hex }}
                          onClick={() => isAvailable && setSelectedColor(color.hex)}
                          title={color.name}
                          disabled={!isAvailable || isLoading}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <button
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={isLoading}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-black mx-6 font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isLoading}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <button
                className="flex-1 bg-black text-white py-4 px-6 rounded-xl font-semibold 
                  hover:bg-gray-900 transition-all duration-300 flex items-center justify-center
                  shadow-lg hover:shadow-xl disabled:bg-gray-500 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Adding..."
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </button>
              {product.customizable && (
                <button
                  className="flex-1 bg-white text-black border-2 border-black py-4 px-6 rounded-xl font-semibold 
                    hover:bg-gray-100 transition-all duration-300 flex items-center justify-center
                    shadow-lg hover:shadow-xl disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed"
                  onClick={handleCustomize}
                  disabled={isLoading}
                >
                  <Pencil className="w-5 h-5 mr-2" />
                  Customize
                </button>
              )}
              <button
                className={`flex-1 ${
                  isInWishlist
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white text-black border-2 border-black hover:bg-gray-100"
                } py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed`}
                onClick={handleWishlistToggle}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Updating..."
                ) : (
                  <>
                    <Heart
                      className={`w-5 h-5 mr-2 ${
                        isInWishlist ? "fill-white" : "fill-none"
                      }`}
                    />
                    {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;