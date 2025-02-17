"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Minus, Plus, ShoppingCart, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Color {
  hex: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  brand: string;
  sizes?: string[];
  colors?: Color[];
  front_image: string;
  back_image?: string;
  left_image?: string;
  right_image?: string;
  category: string;
  sku: string;
  customizable?: boolean;
  designstate?: any;
  propstate?: any;
  designs?: any[];
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
  { hex: "#808080", name: "Gray" }
];

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  );
  // Initialize selectedColor based on whether the product has colors or is customizable
  const [selectedColor, setSelectedColor] = useState(() => {
    if (product.colors && product.colors.length > 0) {
      return product.colors[0].hex;
    } else if (product.customizable) {
      return DEFAULT_COLORS[0].hex; // Default white for customizable products
    }
    return "";
  });
  
  const [mainImage, setMainImage] = useState(product.front_image);
  const [currentSide, setCurrentSide] = useState("front");
  const router = useRouter();

  // Get the appropriate colors array based on whether the product has colors defined
  const colorsToUse = product.customizable 
    ? (product.colors && product.colors.length > 0 ? product.colors : DEFAULT_COLORS)
    : product.colors || [];

  const defaultSizes = ["S", "M", "L", "XL", "2XL"];

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
    onClose();
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

  // Helper function to get design for a specific side
  const getDesignForSide = (side : String) => {
    if (!product.designs || product.designs.length === 0) return null;
    const design = product.designs.find((d) => d.apparel && d.apparel.side === side);
    return design;
  };

  // Helper function to get image URL for a specific side from designs array
  const getImageUrlFromDesigns = (side : String) => {
    if (!product.designs || product.designs.length === 0) return null;
    const design = product.designs.find((d) => d.apparel && d.apparel.side === side);
    return design?.apparel?.url || null;
  };

  // Helper function to update currentSide based on selected image
  const updateCurrentSide = (imgSrc :string) => {
    // Find the corresponding side for this image URL
    const matchingImage = images.find((img) => img.src === imgSrc);
    if (matchingImage) {
      setCurrentSide(matchingImage.side);
    }
  };

  // Get all available images, prioritizing standard product images and falling back to design images
  const getImages = () => {
    const result :any[] = [];
    
    // Add standard product images if they exist
    if (product.front_image) {
      result.push({ src: product.front_image, alt: "Front View", side: "front" });
    }
    if (product.back_image) {
      result.push({ src: product.back_image, alt: "Back View", side: "back" });
    }
    if (product.left_image) {
      result.push({ src: product.left_image, alt: "Left View", side: "leftshoulder" });
    }
    if (product.right_image) {
      result.push({ src: product.right_image, alt: "Right View", side: "rightshoulder" });
    }

    // For customizable products, add missing sides from designs if not already present
    if (product.customizable && product.designs) {
      const sides = ["front", "back", "leftshoulder", "rightshoulder"];
      sides.forEach(side => {
        // Check if we already have this side from standard product images
        if (!result.some(img => img.side === side)) {
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

  // Get position styles for design overlays based on the side
  const getPositionForSide = (side: String) => {
    switch(side) {
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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Left side - Image Gallery */}
          <div className="md:w-1/2 bg-gray-50 p-8">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-6 shadow-lg ring-1 ring-gray-100">
              <Image
                src={mainImage || "/placeholder.svg"}
                alt={product.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
                style={{
                  backgroundColor: product.customizable ? selectedColor : undefined,
                }}
              />
              
              {/* Overlay design image for customizable products */}
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
                      backgroundColor: product.customizable ? selectedColor : undefined,
                    }}
                  />
                  
                  {/* Thumbnail overlay design for customizable products */}
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
                          height: position.height
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

          {/* Right side - Product Details */}
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
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description || "Product description goes here."}
            </p>

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

              {(product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes) && (
                <div>
                  <h3 className="font-medium text-black mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {(product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes).map((size) => (
                      <button
                        key={size}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${
                            selectedSize === size
                              ? "bg-black text-white shadow-md"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Always show color section for customizable products */}
              {(product.colors && product.colors.length > 0) || product.customizable ? (
                <div>
                  <h3 className="font-medium text-black mb-3">Select Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {colorsToUse.map((color) => (
                      <button
                        key={color.hex}
                        className={`w-10 h-10 rounded-full transition-transform duration-200 hover:scale-110
                          ${
                            selectedColor === color.hex
                              ? "ring-2 ring-offset-2 ring-black scale-110"
                              : "ring-1 ring-gray-200"
                          }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color.hex)}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex items-center">
                <button
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-black mx-6 font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                className="flex-1 bg-black text-white py-4 px-6 rounded-xl font-semibold 
                  hover:bg-gray-900 transition-all duration-300 flex items-center justify-center
                  shadow-lg hover:shadow-xl"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              {product.customizable && (
                <button
                  className="flex-1 bg-white text-black border-2 border-black py-4 px-6 rounded-xl font-semibold 
                    hover:bg-gray-100 transition-all duration-300 flex items-center justify-center
                    shadow-lg hover:shadow-xl"
                  onClick={handleCustomize}
                >
                  <Pencil className="w-5 h-5 mr-2" />
                  Customize
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;