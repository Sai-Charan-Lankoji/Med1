"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStock } from "@/app/hooks/useStock"
import { Plus, X, Package } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AddStockDialog({ open, onClose }) {
  const { standardProducts, addStock, loading, error } = useStock()
  const [stockData, setStockData] = useState({
    title: "Batch " + new Date().toISOString().slice(0, 10),
    type: "standard",
    productId: "",
    variants: [{ size: "", color: "", totalQuantity: "" }],
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addStock({
        title: stockData.title,
        variants: stockData.variants.map((v) => ({
          size: v.size,
          color: v.color,
          totalQuantity: Number.parseInt(v.totalQuantity),
        })),
      })
      onClose()
    } catch (err) {
      console.error("Failed to add stock:", err)
    }
  }

  const addVariant = () => {
    setStockData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", color: "", totalQuantity: "" }],
    }))
  }

  const removeVariant = (index) => {
    if (stockData.variants.length > 1) {
      setStockData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }))
    }
  }

  const updateVariant = (index, field, value) => {
    setStockData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add New Stock
          </DialogTitle>
          <DialogDescription>Add new inventory to your stock management system</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Batch Title
              </Label>
              <Input
                id="title"
                value={stockData.title}
                onChange={(e) => setStockData({ ...stockData, title: e.target.value })}
                className="border-slate-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Stock Type
              </Label>
              <Select value={stockData.type} onValueChange={(value) => setStockData({ ...stockData, type: value })}>
                <SelectTrigger className="border-slate-300">
                  <SelectValue placeholder="Select stock type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Product</SelectItem>
                  <SelectItem value="designable">Designable Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {stockData.type === "standard" && (
            <div className="space-y-2">
              <Label htmlFor="productId" className="text-sm font-medium">
                Product
              </Label>
              <Select
                value={stockData.productId}
                onValueChange={(value) => setStockData({ ...stockData, productId: value })}
              >
                <SelectTrigger className="border-slate-300">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {standardProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Variants</Label>
              <Badge variant="outline" className="font-normal">
                {stockData.variants.length} {stockData.variants.length === 1 ? "variant" : "variants"}
              </Badge>
            </div>

            <Card className="border border-slate-200">
              <CardContent className="p-4 space-y-4">
                {stockData.variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-7 gap-3 items-end">
                    <div className="col-span-2">
                      <Label className="text-xs mb-1 block">Size</Label>
                      <Select value={variant.size} onValueChange={(value) => updateVariant(index, "size", value)}>
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="S">Small</SelectItem>
                          <SelectItem value="M">Medium</SelectItem>
                          <SelectItem value="L">Large</SelectItem>
                          <SelectItem value="XL">Extra Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs mb-1 block">Color</Label>
                      <Select value={variant.color} onValueChange={(value) => updateVariant(index, "color", value)}>
                        <SelectTrigger className="border-slate-300">
                          <SelectValue placeholder="Color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="black">Black</SelectItem>
                          <SelectItem value="white">White</SelectItem>
                          <SelectItem value="navy">Navy</SelectItem>
                          <SelectItem value="gray">Gray</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs mb-1 block">Quantity</Label>
                      <Input
                        type="number"
                        value={variant.totalQuantity}
                        onChange={(e) => updateVariant(index, "totalQuantity", e.target.value)}
                        className="border-slate-300"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-500 hover:text-red-500"
                        onClick={() => removeVariant(index)}
                        disabled={stockData.variants.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="w-full mt-2 border-dashed border-slate-300 text-slate-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </CardContent>
            </Card>
          </div>

          {error && <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</div>}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Adding..." : "Add Stock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

