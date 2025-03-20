"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, X, AlertCircle, Info } from "lucide-react"
import Select from "react-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { productFormSchema, type ProductFormValues } from "./schema"
import { useStock } from "@/app/hooks/useStock"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CATEGORIES = [
  { value: "Clothing", label: "Clothing" },
  { value: "Shoes", label: "Shoes" },
  { value: "Accessories", label: "Accessories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Home", label: "Home" },
]

const COLORS = [
  { hex: "#FF0000", name: "Red" },
  { hex: "#00FF00", name: "Green" },
  { hex: "#0000FF", name: "Blue" },
  { hex: "#FFFF00", name: "Yellow" },
  { hex: "#800080", name: "Purple" },
  { hex: "#FFA500", name: "Orange" },
  { hex: "#FFC0CB", name: "Pink" },
  { hex: "#A52A2A", name: "Brown" },
  { hex: "#808080", name: "Gray" },
  { hex: "#000000", name: "Black" },
  { hex: "#FFFFFF", name: "White" },
]

const CLOTHING_SIZES = ["S", "M", "L", "XL", "2XL"]
const SHOE_SIZES = ["7", "8", "9", "10", "11", "12"]

// Helper function to determine if a size array is likely clothing or shoes
const detectCategoryFromSizes = (sizes: string[]): string | null => {
  if (!sizes || sizes.length === 0) return null

  // Check if sizes match clothing pattern (S, M, L, etc.)
  const clothingSizePattern = /^(XS|S|M|L|XL|XXL|2XL|3XL|4XL)$/i
  const clothingSizes = sizes.filter((size) => clothingSizePattern.test(size))

  // Check if sizes match shoe pattern (numeric sizes)
  const shoeSizePattern = /^([0-9]|1[0-9]|2[0-9])(\.[05])?$/
  const shoeSizes = sizes.filter((size) => shoeSizePattern.test(size))

  if (clothingSizes.length > shoeSizes.length) return "Clothing"
  if (shoeSizes.length > clothingSizes.length) return "Shoes"

  return null // Can't determine
}

export function ProductUploadForm({
  onClose,
  store,
  productType,
}: {
  onClose?: () => void
  store: { id: string; store_url: string; vendor_id: string }
  productType: string
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedStock, setSelectedStock] = useState<any>(null)
  const isCustomizable = productType === "customizable"
  const { stocks, loading } = useStock()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      sizes: [],
      colors: [],
      stockId: undefined,
      brand: "",
      sku: "",
      discount: null,
      sale: false,
      store_id: store.id,
      product_type: isCustomizable ? "customizable" : "standard",
      front_image: null,
      back_image: null,
      left_image: null,
      right_image: null,
    },
    mode: "onChange", // Enable validation on change
  })

  const category = form.watch("category")
  const sale = form.watch("sale")
  const stockId = form.watch("stockId")
  const formErrors = form.formState.errors
  const hasErrors = Object.keys(formErrors).length > 0

  // Handle category change based on sizes
  useEffect(() => {
    if (category !== "Clothing" && category !== "Shoes") {
      form.setValue("sizes", [])
    }
  }, [category, form])

  const handleSideImageUpload = (side: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (fileEvent) => {
        if (fileEvent.target?.result) {
          form.setValue(side as keyof ProductFormValues, fileEvent.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleStockChange = (selectedOption: any) => {
    const stock = stocks.find((stock) => stock.stock_id === selectedOption?.value)
    setSelectedStock(stock)

    if (stock) {
      const variants = stock.StockVariants || []
      const sizes = Array.from(new Set(variants.map((v) => v.size)))
      const colors = variants
        .map((v) => ({
          label: v.color || "N/A",
          value: v.color || "N/A",
        }))
        .filter((c, idx, self) => self.findIndex((t) => t.value === c.value) === idx)

      // Set sizes and colors
      form.setValue("sizes", sizes)
      form.setValue("colors", colors)
      form.setValue("stockId", stock.stock_id)

      // Auto-detect and set category based on sizes
      const detectedCategory = detectCategoryFromSizes(sizes)
      if (detectedCategory) {
        form.setValue("category", detectedCategory)
      }
    } else {
      form.setValue("sizes", [])
      form.setValue("colors", [])
      form.setValue("stockId", undefined)
    }
  }

  const redirectToStore = (formData: ProductFormValues) => {
    try {
      const simplifiedData = {
        ...formData,
        product_type: "customizable",
        colors: undefined,
        front_image: undefined,
        back_image: undefined,
        left_image: undefined,
        right_image: undefined,
      }
      const serializedData = encodeURIComponent(JSON.stringify(simplifiedData))
      const storeUrl = `${store.store_url}/${store.vendor_id}?productData=${serializedData}`
      window.open(storeUrl, "_blank")
    } catch (error) {
      console.error("Redirect error:", error)
      alert("Failed to proceed to store")
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (formData: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      if (isCustomizable) {
        redirectToStore(formData);
        return;
      }
  
      const preparedData = {
        ...formData,
        stock_id: formData.stockId, // Map stockId to stock_id
        discount: sale ? formData.discount : 0,
      };
  
      const response = await fetch("http://localhost:5000/api/standardproducts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preparedData),
      });
  
      if (!response.ok) throw new Error("Upload failed");
  
      const result = await response.json();
      console.log("Upload success:", result);
      onClose?.();
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="images" disabled={isCustomizable}>
            Images
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* {hasErrors && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Please fix the errors in the form before submitting. {formerr}</AlertDescription>
              </Alert>
            )} */}

            <TabsContent value="basic" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
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
                            value={field.value === 0 ? "" : field.value}
                            onChange={(e) => {
                              const value = e.target.value === "" ? undefined : Number(e.target.value)
                              field.onChange(value)
                            }}
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
                      <Textarea placeholder="Enter product description" className="h-24 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand name" {...field} />
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
                        <Input placeholder="SKU code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="sale"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="mt-0">On Sale</FormLabel>
                    </FormItem>
                  )}
                />

                {sale && (
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10"
                            {...field}
                            value={field.value === 0 && field.name === document.activeElement?.id ? "" : field.value}
                            onChange={(e) => {
                              const value = e.target.value === "" ? 0 : Number(e.target.value)
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setActiveTab("inventory")}>
                  Next: Inventory
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          options={CATEGORIES}
                          value={CATEGORIES.find((c) => c.value === field.value)}
                          onChange={(val) => field.onChange(val?.value)}
                          placeholder="Select category"
                          isDisabled={!isCustomizable && !!stockId}
                          classNames={{
                            control: () => (!isCustomizable && !!stockId ? "bg-gray-100" : ""),
                          }}
                        />
                      </FormControl>
                      {!isCustomizable && !!stockId && (
                        <FormDescription className="text-xs flex items-center mt-1">
                          <Info className="h-3 w-3 mr-1" />
                          Category is determined by stock selection
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isCustomizable && (
                  <FormField
                    control={form.control}
                    name="stockId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Stock</FormLabel>
                        <FormControl>
                          <Select
                            options={stocks.map((stock) => ({
                              value: stock.stock_id,
                              label: stock.title,
                              data: stock,
                            }))}
                            value={
                              field.value
                                ? {
                                    value: field.value,
                                    label: stocks.find((s) => s.stock_id === field.value)?.title || "Unknown",
                                  }
                                : null
                            }
                            onChange={(val) => {
                              field.onChange(val?.value)
                              handleStockChange(val)
                            }}
                            placeholder={loading ? "Loading stocks..." : "Select stock batch"}
                            isLoading={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {selectedStock && !isCustomizable && (
                <Card className="bg-slate-50">
                  <CardContent className="pt-6">
                    <h3 className="text-sm font-medium mb-2">Selected Stock Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Quantity:</p>
                        <p className="font-medium">{selectedStock.totalQuantity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available Quantity:</p>
                        <p className="font-medium">{selectedStock.availableQuantity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available Sizes:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedStock.availableVariants.sizes.map((size: string, i: number) => (
                            <Badge key={`size-${i}`} variant="outline" className="text-xs">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Available Colors:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedStock.availableVariants.colors.map((color: string, i: number) => (
                            <Badge key={`color-${i}`} variant="outline" className="text-xs">
                              <div
                                className="h-2 w-2 rounded-full mr-1 inline-block"
                                style={{
                                  backgroundColor: color.toLowerCase(),
                                  border: color.toLowerCase() === "white" ? "1px solid #ddd" : "none",
                                }}
                              />
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(category === "Clothing" || category === "Shoes") && (
                <FormField
                  control={form.control}
                  name="sizes"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Sizes</FormLabel>
                        {!isCustomizable && !!stockId && (
                          <Badge variant="outline" className="font-normal text-xs">
                            Auto-populated from stock
                          </Badge>
                        )}
                      </div>
                      <FormControl>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                          {(category === "Clothing" ? CLOTHING_SIZES : SHOE_SIZES).map((size) => (
                            <div
                              key={size}
                              className={`
                                flex items-center p-2 border rounded-md
                                ${field.value?.includes(size) ? "bg-primary/10 border-primary" : "border-gray-200"}
                                ${!isCustomizable && !!stockId ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}
                              `}
                              onClick={() => {
                                if (isCustomizable || !stockId) {
                                  const updated = field.value?.includes(size)
                                    ? field.value.filter((s: string) => s !== size)
                                    : [...(field.value || []), size]
                                  field.onChange(updated)
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                id={`size-${size}`}
                                checked={field.value?.includes(size)}
                                onChange={() => {}}
                                className="form-checkbox h-4 w-4 mr-2"
                                disabled={!isCustomizable && !!stockId}
                              />
                              <label htmlFor={`size-${size}`} className="font-medium text-sm w-full cursor-pointer">
                                {size}
                              </label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Colors</FormLabel>
                      {!isCustomizable && !!stockId && (
                        <Badge variant="outline" className="font-normal text-xs">
                          Auto-populated from stock
                        </Badge>
                      )}
                    </div>
                    <FormControl>
                      <Select
                        isMulti
                        options={COLORS.map((c) => ({ value: c.hex, label: c.name }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select colors"
                        formatOptionLabel={({ value, label }) => (
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 mr-2 rounded-full"
                              style={{
                                backgroundColor: value,
                                border: value === "#FFFFFF" ? "1px solid #ddd" : "none",
                              }}
                            />
                            <span>{label}</span>
                          </div>
                        )}
                        isDisabled={!isCustomizable && !!stockId}
                        classNames={{
                          control: () => (!isCustomizable && !!stockId ? "bg-gray-100" : ""),
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                  Back
                </Button>
                {!isCustomizable ? (
                  <Button type="button" onClick={() => setActiveTab("images")}>
                    Next: Images
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      "Next"
                    )}
                  </Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {["front_image", "back_image", "left_image", "right_image"].map((side) => (
                  <FormField
                    key={side}
                    control={form.control}
                    name={side as keyof ProductFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="capitalize">{side.replace("_", " ")}</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center space-y-2">
                            {field.value ? (
                              <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                                <img
                                  src={(field.value as string) || "/placeholder.svg"}
                                  alt={side}
                                  className="w-full h-full object-contain"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                                  onClick={() => form.setValue(side as keyof ProductFormValues, null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full h-48 border-dashed"
                                onClick={() => {
                                  const input = document.createElement("input")
                                  input.type = "file"
                                  input.accept = "image/*"
                                  input.onchange = (e) =>
                                    handleSideImageUpload(side, e as unknown as React.ChangeEvent<HTMLInputElement>)
                                  input.click()
                                }}
                              >
                                <div className="flex flex-col items-center">
                                  <Plus className="h-8 w-8 mb-2 text-gray-400" />
                                  <span className="text-sm text-gray-500">Upload {side.replace("_", " ")}</span>
                                </div>
                              </Button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("inventory")}>
                  Back
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
            </TabsContent>
          </form>
        </Form>
      </Tabs>

      {!isCustomizable && (
        <TooltipProvider>
          <div className="flex justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Discard changes and close form</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )}
    </div>
  )
}

