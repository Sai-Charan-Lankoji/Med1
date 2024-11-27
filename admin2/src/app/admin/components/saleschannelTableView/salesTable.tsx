'use client'

import React, { useState } from "react"
import Image from "next/image"
import { useGetProducts } from "@/app/hooks/products/useGetProducts"
import { Checkbox } from "@/components/ui/checkbox"

const SalesTable = () => {
  const { data: productsData, error, isLoading } = useGetProducts()
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
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

  if (isLoading) return <div className="text-center text-white">Loading...</div>
  if (error) return <div className="text-center text-red-500">Error loading products</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white/5">
            <th className="p-3">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all products"
              />
            </th>
            <th className="p-3 text-left text-sm font-medium text-black/80">Name</th>
            <th className="p-3 text-left text-sm font-medium text-black/80">Collection</th>
          </tr>
        </thead>
        <tbody>
          {productsData?.map((product: any) => (
            <tr key={product.id} className="border-t border-white/10 hover:bg-white/5">
              <td className="p-3">
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => handleSelectProduct(product.id)}
                  aria-label={`Select ${product.title}`}
                />
              </td>
              <td className="p-3 flex items-center">
                <div className="w-12 h-12 mr-4 relative">
                  <Image
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.title}
                    className="rounded-md object-cover"
                    fill
                    sizes="(max-width: 48px) 100vw, 48px"
                    priority
                  />
                </div>
                <span className="text-sm text-white">{product.title}</span>
              </td>
              <td className="p-3 text-sm text-white/80">{product.collection || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SalesTable