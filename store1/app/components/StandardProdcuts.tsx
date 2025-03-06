"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Eye, Tag } from "lucide-react"
import ProductDetailModal from "./ProductDetailModal"

interface Variant {
  variantId: string
  size: string
  color: string
  availableQuantity: number
}

interface StandardProduct {
  id: string
  title: string
  description: string
  price: number
  brand: string
  front_image: string
  back_image: string
  left_image: string
  right_image: string
  category: string
  sku: string
  sale: boolean
  customizable: boolean
  stock_id?: string
  Stock?: {
    StockVariants: Variant[]
  }
}

interface StandardProductsProps {
  products: StandardProduct[]
}

const StandardProducts: React.FC<StandardProductsProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<StandardProduct | null>(null)

  const handleQuickView = (product: StandardProduct) => {
    setSelectedProduct(product)
  }

  const closeModal = () => {
    setSelectedProduct(null)
  }

  // Helper to get available sizes for a product from StockVariants
  const getSizesForProduct = (product: StandardProduct): string[] => {
    const variants = product.Stock?.StockVariants
    if (!variants || variants.length === 0) return []

    // Only include sizes that have available quantity
    return [...new Set(variants.filter((v) => v.availableQuantity > 0).map((v) => v.size))].sort((a, b) => {
      // Sort sizes in a logical order
      const sizeOrder = { S: 1, M: 2, L: 3, XL: 4, "2XL": 5 }
      return (sizeOrder[a as keyof typeof sizeOrder] || 99) - (sizeOrder[b as keyof typeof sizeOrder] || 99)
    })
  }

  // Helper to get available colors for a product from StockVariants
  const getColorsForProduct = (product: StandardProduct): string[] => {
    const variants = product.Stock?.StockVariants
    if (!variants || variants.length === 0) return []

    // Only include colors that have available quantity
    return [...new Set(variants.filter((v) => v.availableQuantity > 0 && v.color).map((v) => v.color))]
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {products.map((product) => {
          const availableSizes = getSizesForProduct(product)
          const availableColors = getColorsForProduct(product)

          return (
            <motion.div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              whileHover={{ y: -5 }}
            >
              <div className="relative aspect-square">
                <Image
                  src={product.front_image || "/placeholder.svg"}
                  alt={product.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <motion.button
                    className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleQuickView(product)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Quick View
                  </motion.button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
                  {product.category && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {product.category}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-2 font-medium">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mb-3">Brand: {product.brand}</p>

                {availableSizes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Available Sizes:</p>
                    <div className="flex flex-wrap gap-1">
                      {availableSizes.map((size) => (
                        <span
                          key={size}
                          className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {availableColors.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Available Colors:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((color) => (
                        <div
                          key={color}
                          className="w-5 h-5 rounded-full ring-1 ring-gray-200"
                          style={{
                            backgroundColor: color.toLowerCase(),
                            border: color.toLowerCase() === "white" ? "1px solid #ddd" : "none",
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={closeModal} />}
    </>
  )
}

export default StandardProducts

