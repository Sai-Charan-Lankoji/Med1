import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Eye } from "lucide-react"
import ProductDetailModal from "./ProductDetailModal"
interface StandardProduct {
  id: string
  title: string
  description: string
  price: number
  brand: string
  sizes: string[]
  colors: { hex: string; name: string }[]
  front_image: string
  back_image: string
  left_image: string
  right_image: string
  category: string
  sku: string
  sale: boolean
  customizable: boolean
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

  const defaultSizes = [ "S", "M", "L", "XL","2XL"]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
        {products.map((product) => (
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-2 font-medium">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mb-3">Brand: {product.brand}</p>
              <div className="flex flex-wrap gap-2">
                {(product.sizes && product.sizes.length > 0 ? product.sizes : defaultSizes).map((size: string) => (
                  <span key={size} className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={closeModal} />}
    </>
  )
}

export default StandardProducts

