"use client";

import type React from "react";
import { useState } from "react";
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

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].hex : ""
  );
  const [mainImage, setMainImage] = useState(product.front_image);
  const router = useRouter();

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

  const images = [
    { src: product.front_image, alt: "Front View" },
    { src: product.back_image, alt: "Back View" },
    { src: product.left_image, alt: "Left View" },
    { src: product.right_image, alt: "Right View" },
  ].filter((img) => img.src);

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
              />
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
                  onClick={() => setMainImage(img.src!)}
                >
                  <Image
                    src={img.src || "/placeholder.svg"}
                    alt={img.alt}
                    layout="fill"
                    objectFit="cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Product Details */}
          <div className="md:w-1/2 p-8 flex flex-col bg-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-black mb-2">
                  {product.title}
                </h2>
                <p className="text-2xl font-semibold text-black">
                  ${product.price}
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
              {product.description}
            </p>

            <div className="space-y-6 flex-grow">
              <div className="flex gap-6 text-sm text-gray-500">
                <div>
                  <span className="block font-medium text-black">Brand</span>
                  {product.brand}
                </div>
                <div>
                  <span className="block font-medium text-black">Category</span>
                  {product.category}
                </div>
                <div>
                  <span className="block font-medium text-black">SKU</span>
                  {product.sku}
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="font-medium text-black mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
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

              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="font-medium text-black mb-3">Select Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
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
              )}

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
