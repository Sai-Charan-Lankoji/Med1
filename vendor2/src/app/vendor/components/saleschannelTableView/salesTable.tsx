'use client'

import React, { useState } from "react"
import Image from "next/image"
import { useGetProducts } from "@/app/hooks/products/useGetProducts"

const SalesTable = () => {
  const { allProducts, isLoading, error } = useGetProducts()
  const productsData = allProducts?.standard || []
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    if (checked) {
      const allProductIds = productsData?.map((product: any) => product.id) || []
      setSelectedProducts(allProductIds)
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId)
      } else {
        return [...prevSelected, productId]
      }
    })
  }

  const isAllSelected = productsData?.length > 0 && selectedProducts.length === productsData?.length

  if (isLoading.any) return (
    <div className="flex justify-center py-8">
      <span className="loading loading-spinner loading-md text-primary"></span>
    </div>
  )
  
  if (error.any || error) return (
    <div className="alert alert-error">
      <span>Error loading products</span>
    </div>
  )

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="bg-base-200">
            <th className="w-12">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={isAllSelected}
                onChange={handleSelectAll}
                aria-label="Select all products"
              />
            </th>
            <th className="text-base-content/80">Name</th>
            <th className="text-base-content/80">Collection</th>
          </tr>
        </thead>
        <tbody>
          {productsData?.map((product: any) => (
            <tr key={product.id} className="hover:bg-base-200">
              <td>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                  aria-label={`Select ${product.title}`}
                />
              </td>
              <td className="flex items-center gap-4">
                <div className="w-12 h-12 relative">
                  <Image
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.title}
                    className="rounded-md object-cover"
                    fill
                    sizes="(max-width: 48px) 100vw, 48px"
                    priority
                  />
                </div>
                <span className="text-base-content">{product.title}</span>
              </td>
              <td className="text-base-content/80">{product.collection || "-"}</td>
            </tr>
          ))}
          {productsData?.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-8 text-base-content/70">
                No products available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default SalesTable