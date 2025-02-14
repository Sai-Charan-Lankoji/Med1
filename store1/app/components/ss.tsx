import React, { useState } from "react"
import { X, Minus, Plus, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
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
}

interface ProductDetailModalProps {
  product: Product
  onClose: () => void
  customerId?: string
  customerEmail?: string
}

interface CartPayload {
  customer_id: string
  email: string
  product_id: string
  product_type: string
  quantity: number
  price: number
  total_price: number
  selected_size: string
  selected_color: string
}

const useAddToCart = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const addToCart = async (payload: CartPayload) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5000/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      router.push('/cart') // Redirect to cart page on success
      return data

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { addToCart, isLoading, error }
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  onClose,
  customerId = sessionStorage.getItem('customerId') || '', 
  customerEmail = sessionStorage.getItem('email') || '', 
}) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "")
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.hex || "")
  const [mainImage, setMainImage] = useState(product.front_image)
  const { addToCart, isLoading, error } = useAddToCart()

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const handleAddToCart = async () => {
    try {
      const payload: CartPayload = {
        customer_id: customerId,
        email: customerEmail,
        product_id: product.id,
        product_type: product.category,
        quantity: quantity,
        price: product.price,
        total_price: product.price * quantity,
        selected_size: selectedSize,
        selected_color: selectedColor
      }

      await addToCart(payload)
      onClose()
    } catch (err) {
      console.error('Failed to add to cart:', err)
    }
  }

  const images = [
    { src: product.front_image, alt: "Front View" },
    { src: product.back_image, alt: "Back View" },
    { src: product.left_image, alt: "Left View" },
    { src: product.right_image, alt: "Right View" },
  ].filter((img) => img.src)

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Previous JSX remains the same until the Add to Cart button */}
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Image gallery section - same as before */}
          <div className="md:w-1/2 bg-gray-50 p-8">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-6 shadow-lg ring-1 ring-gray-100">
              <img 
                src={mainImage || "/placeholder.svg"} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 
                    ${mainImage === img.src ? 
                      'ring-2 ring-black shadow-lg scale-95' : 
                      'hover:ring-2 hover:ring-gray-300 hover:shadow-md'
                    }`}
                  onClick={() => setMainImage(img.src)}
                >
                  <img 
                    src={img.src || "/placeholder.svg"} 
                    alt={img.alt} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product details section */}
          <div className="md:w-1/2 p-8 flex flex-col bg-white">
            {/* Previous content remains the same */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-black mb-2">{product.title}</h2>
                <p className="text-2xl font-semibold text-black">
                  ${product.price.toFixed(2)}
                  <span className="text-sm text-gray-500 ml-2">
                    Total: ${(product.price * quantity).toFixed(2)}
                  </span>
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Rest of the content remains the same until the Add to Cart button */}
            {/* ... */}

            <div className="mt-6">
              {error && (
                <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <button
                className={`w-full bg-black text-white py-4 px-6 rounded-xl font-semibold 
                  transition-all duration-300 flex items-center justify-center
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-900 shadow-lg hover:shadow-xl'}`}
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isLoading ? 'Adding to Cart...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal