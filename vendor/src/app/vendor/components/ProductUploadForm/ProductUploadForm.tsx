"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, X } from "lucide-react"
import Select from "react-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { productFormSchema, type ProductFormValues } from "./schema"

// Define categories, colors, and sizes
const CATEGORIES = [
  { value: "Clothing", label: "Clothing" },
  { value: "Shoes", label: "Shoes" },
  { value: "Accessories", label: "Accessories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Home", label: "Home" },
]

const COLORS = [
  { value: "#FF0000", label: "Red" },
  { value: "#00FF00", label: "Green" },
  { value: "#0000FF", label: "Blue" },
  { value: "#FFFF00", label: "Yellow" },
  { value: "#800080", label: "Purple" },
  { value: "#FFA500", label: "Orange" },
  { value: "#FFC0CB", label: "Pink" },
  { value: "#A52A2A", label: "Brown" },
  { value: "#808080", label: "Gray" },
  { value: "#000000", label: "Black" },
  { value: "#FFFFFF", label: "White" },
]

const SIZES = [
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "Extra Large" },
]

export function ProductUploadForm({ onClose, store }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: null,
      category: "",
      sizes: [],
      colors: [],
      stock: null,
      images: [],
      brand: "",
      sku: "",
      weight: null,
      dimensions: { length: null, width: null, height: null },
      store_id: store.id,
    },
  })

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true)
    try {
      const response = await fetch("http://localhost:5000/api/standardproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          colors: data.colors.map(color => ({
            name: color.name,
            hex: color.hex
          })),
          sizes: Array.isArray(data.sizes) ? data.sizes : [data.sizes].filter(Boolean)
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to upload product")
      }

      const result = await response.json()
      console.log(result)
      onClose?.()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter product description" className="h-24" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    options={CATEGORIES}
                    value={CATEGORIES.find((option) => option.value === field.value)}
                    onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                    placeholder="Select a category"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
  control={form.control}
  name="sizes"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Sizes</FormLabel>
      <FormControl>
        <div className="flex flex-wrap gap-4">
          {SIZES.map((size) => (
            <div key={size.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={size.value}
                checked={field.value.includes(size.value)}
                onChange={(e) => {
                  const updatedSizes = e.target.checked
                    ? [...field.value, size.value]
                    : field.value.filter((s: string) => s !== size.value);
                  field.onChange(updatedSizes);
                }}
                className="form-checkbox h-4 w-4"
              />
              <label htmlFor={size.value} className="font-normal cursor-pointer">
                {size.label}
              </label>
            </div>
          ))}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

        <FormField
          control={form.control}
          name="colors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Colors</FormLabel>
              <FormControl>
                <Select
                  isMulti
                  options={COLORS}
                  value={field.value.map((color) => ({
                    value: color.hex,
                    label: color.name,
                  }))}
                  onChange={(selectedOptions) => {
                    field.onChange(
                      selectedOptions.map((option) => ({
                        name: option.label,
                        hex: option.value,
                      }))
                    )
                  }}
                  placeholder="Select colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Enter SKU" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dimensions.length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="dimensions.width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dimensions.height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <div className="flex flex-wrap gap-2">
                {field.value.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image || "/api/placeholder/96/96"}
                      alt={`Product ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => {
                        const newImages = field.value.filter((_, i) => i !== index)
                        field.onChange(newImages)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-24 h-24"
                  onClick={() => {
                    const fileInput = document.createElement("input")
                    fileInput.type = "file"
                    fileInput.accept = "image/*"
                    fileInput.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (fileEvent) => {
                          field.onChange([...field.value, fileEvent.target?.result])
                        }
                        reader.readAsDataURL(file)
                      }
                    }
                    fileInput.click()
                  }}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Product"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}