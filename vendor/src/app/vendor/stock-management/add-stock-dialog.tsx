"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddStockDialog({ open, onClose }) {
  const [stockData, setStockData] = useState({
    type: "standard",
    productId: "",
    quantity: "",
    size: "",
    color: "",
    material: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle stock creation
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Stock Type</Label>
            <Select value={stockData.type} onValueChange={(value) => setStockData({ ...stockData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select stock type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Product</SelectItem>
                <SelectItem value="designable">Designable Product</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="productId">Product ID</Label>
            <Input
              id="productId"
              value={stockData.productId}
              onChange={(e) => setStockData({ ...stockData, productId: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quantity">Initial Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={stockData.quantity}
              onChange={(e) => setStockData({ ...stockData, quantity: e.target.value })}
            />
          </div>

          {stockData.type === "standard" ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="size">Size</Label>
                <Select value={stockData.size} onValueChange={(value) => setStockData({ ...stockData, size: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">Small</SelectItem>
                    <SelectItem value="M">Medium</SelectItem>
                    <SelectItem value="L">Large</SelectItem>
                    <SelectItem value="XL">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="material">Material</Label>
              <Select
                value={stockData.material}
                onValueChange={(value) => setStockData({ ...stockData, material: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="polyester">Polyester</SelectItem>
                  <SelectItem value="blend">Cotton Blend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="color">Color</Label>
            <Select value={stockData.color} onValueChange={(value) => setStockData({ ...stockData, color: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="navy">Navy</SelectItem>
                <SelectItem value="gray">Gray</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-500">
              Add Stock
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

