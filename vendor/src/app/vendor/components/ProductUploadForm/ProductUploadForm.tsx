// components/ProductUploadForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { productFormSchema, type ProductFormValues } from "./schema";
import { useStock } from "@/app/hooks/useStock";

const CATEGORIES = [
  { value: "Clothing", label: "Clothing" },
  { value: "Shoes", label: "Shoes" },
  { value: "Accessories", label: "Accessories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Home", label: "Home" },
];

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
];

const CLOTHING_SIZES = ["S", "M", "L", "XL", "2XL"];
const SHOE_SIZES = ["7", "8", "9", "10", "11", "12"];

export function ProductUploadForm({ onClose, store, productType }: { onClose?: () => void; store: { id: string; store_url: string; vendor_id: string }; productType: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isCustomizable = productType === "customizable";
  const { stocks, loading } = useStock();

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
  });

  const category = form.watch("category");
  const sale = form.watch("sale");

  useEffect(() => {
    if (category !== "Clothing" && category !== "Shoes") {
      form.setValue("sizes", []);
    }
  }, [category, form]);

  const handleSideImageUpload = (side: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (fileEvent) => {
        if (fileEvent.target?.result) {
          form.setValue(side as keyof ProductFormValues, fileEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStockChange = (selectedOption: any) => {
    const selectedStock = stocks.find(stock => stock.stockId === selectedOption?.value);
    if (selectedStock) {
      const variants = selectedStock.StockVariants || [];
      const sizes = [...new Set(variants.map(v => v.size))];
      const colors = variants.map(v => ({
        label: v.color || "N/A",
        value: v.color || "N/A",
      })).filter((c, idx, self) => self.findIndex(t => t.value === c.value) === idx);
      form.setValue("sizes", sizes);
      form.setValue("colors", colors);
      form.setValue("stockId", selectedStock.stockId);
    } else {
      form.setValue("sizes", []);
      form.setValue("colors", []);
      form.setValue("stockId", undefined);
    }
  };

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
      };
      const serializedData = encodeURIComponent(JSON.stringify(simplifiedData));
      const storeUrl = `${store.store_url}/${store.vendor_id}?productData=${serializedData}`;
      window.open(storeUrl, "_blank");
    } catch (error) {
      console.error("Redirect error:", error);
      alert("Failed to proceed to store");
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      if (isCustomizable) {
        redirectToStore(formData);
        return;
      }

      const preparedData = {
        ...formData,
        colors: formData.colors?.map((color: any) => ({
          name: color.label,
          hex: color.value,
        })),
        sizes: formData.sizes,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                    onChange={e => field.onChange(Number(e.target.value))}
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
                    value={CATEGORIES.find(c => c.value === field.value)}
                    onChange={val => field.onChange(val?.value)}
                    placeholder="Select category"
                  />
                </FormControl>
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
                      options={stocks.map(stock => ({ value: stock.stockId, label: stock.title }))}
                      value={field.value ? { value: field.value, label: stocks.find(s => s.stockId === field.value)?.title || "Unknown" } : null}
                      onChange={val => {
                        field.onChange(val?.value);
                        handleStockChange(val);
                      }}
                      placeholder="Select stock batch"
                      isLoading={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {(category === "Clothing" || category === "Shoes") && (
          <FormField
            control={form.control}
            name="sizes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sizes</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-4">
                    {(category === "Clothing" ? CLOTHING_SIZES : SHOE_SIZES).map(size => (
                      <div key={size} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={size}
                          checked={field.value?.includes(size)}
                          onChange={e => {
                            const updated = e.target.checked
                              ? [...field.value, size]
                              : field.value.filter((s: string) => s !== size);
                            field.onChange(updated);
                          }}
                          className="form-checkbox h-4 w-4"
                          disabled={!isCustomizable}
                        />
                        <label htmlFor={size} className="font-medium">{size}</label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {!isCustomizable && (
          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colors</FormLabel>
                <FormControl>
                  <Select
                    isMulti
                    options={COLORS.map(c => ({ value: c.hex, label: c.name }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select colors"
                    formatOptionLabel={({ value, label }) => (
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 rounded-full" style={{ backgroundColor: value }} />
                        <span>{label}</span>
                      </div>
                    )}
                    isDisabled={!isCustomizable}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid gap-4 md:grid-cols-2">
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
                <FormLabel>On Sale</FormLabel>
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
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {!isCustomizable && (
          <div className="grid grid-cols-2 gap-4">
            {["front_image", "back_image", "left_image", "right_image"].map(side => (
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
                          <div className="relative">
                            <img src={field.value as string} alt={side} className="w-24 h-24 object-cover rounded-md" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => form.setValue(side as keyof ProductFormValues, null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-24 h-24"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e) =>
                                handleSideImageUpload(side, e as unknown as React.ChangeEvent<HTMLInputElement>);
                              input.click();
                            }}
                          >
                            <Plus className="h-6 w-6" />
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
        )}

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isCustomizable ? "Redirecting..." : "Uploading..."}
              </>
            ) : isCustomizable ? "Next" : "Upload Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}