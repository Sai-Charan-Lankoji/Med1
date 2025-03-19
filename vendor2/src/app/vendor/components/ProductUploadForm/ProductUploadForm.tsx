"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X, AlertCircle, Info } from "lucide-react";
import Select from "react-select";
import { productFormSchema, type ProductFormValues } from "./schema";
import { useStock } from "@/app/hooks/useStock";

// Enhanced product categories with descriptions
const CATEGORIES = [
  { value: "Clothing", label: "Clothing", description: "Shirts, pants, dresses, etc." },
  { value: "Shoes", label: "Shoes", description: "Sneakers, boots, sandals, etc." },
  { value: "Accessories", label: "Accessories", description: "Belts, hats, jewelry, etc." },
  { value: "Electronics", label: "Electronics", description: "Gadgets, devices, appliances, etc." },
  { value: "Home", label: "Home", description: "Furniture, decor, kitchenware, etc." },
];

// Enhanced color options with descriptions
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

// Enhanced size options with more variety
const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const SHOE_SIZES = ["5", "6", "7", "8", "9", "10", "11", "12", "13"];

// Helper function to determine if a size array is likely clothing or shoes
const detectCategoryFromSizes = (sizes: string[]): string | null => {
  if (!sizes || sizes.length === 0) return null;

  const clothingSizePattern = /^(XS|S|M|L|XL|XXL|2XL|3XL|4XL)$/i;
  const clothingSizes = sizes.filter((size) => clothingSizePattern.test(size));

  const shoeSizePattern = /^([0-9]|1[0-9]|2[0-9])(\.[05])?$/;
  const shoeSizes = sizes.filter((size) => shoeSizePattern.test(size));

  if (clothingSizes.length > shoeSizes.length) return "Clothing";
  if (shoeSizes.length > clothingSizes.length) return "Shoes";

  return null;
};

export function ProductUploadForm({
  onClose,
  store,
  productType,
}: {
  onClose?: () => void;
  store: { id: string; store_url: string; vendor_id: string };
  productType: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedStock, setSelectedStock] = useState<any>(null);
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
    mode: "onChange",
  });

  const category = form.watch("category");
  const sale = form.watch("sale");
  const stockId = form.watch("stockId");
  const formErrors = form.formState.errors;
  const hasErrors = Object.keys(formErrors).length > 0;

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
    const stock = stocks.find((stock) => stock.stock_id === selectedOption?.value);
    setSelectedStock(stock);

    if (stock) {
      const variants = stock.StockVariants || [];
      const sizes = Array.from(new Set(variants.map((v) => v.size)));
      const colors = variants
        .map((v) => ({ label: v.color || "N/A", value: v.color || "N/A" }))
        .filter((c, idx, self) => self.findIndex((t) => t.value === c.value) === idx);

      form.setValue("sizes", sizes);
      form.setValue("colors", colors);
      form.setValue("stockId", stock.stock_id);

      const detectedCategory = detectCategoryFromSizes(sizes);
      if (detectedCategory) {
        form.setValue("category", detectedCategory);
      }
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
        stock_id: formData.stockId,
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
  
  // Helper function to check if a specific field has an error
  const hasFieldError = (fieldName: keyof ProductFormValues) => {
    return !!formErrors[fieldName];
  };

  // Helper function to render error message for a field
  const getFieldErrorMessage = (fieldName: keyof ProductFormValues) => {
    return formErrors[fieldName]?.message as string;
  };

  return (
    <div className="card bg-base-100 ">
      <div className="card-body p-6">
        {/* Tabs */}
        <div className="tabs tabs-box bg-base-200 mb-6 flex justify-between">
          <button
            className={`tab  ${activeTab === "basic" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`tab  ${activeTab === "inventory" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("inventory")}
          >
            Inventory
          </button>
          {!isCustomizable && (
            <button
              className={`tab ${activeTab === "images" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("images")}
            >
              Images
            </button>
          )}
        </div>

        {/* Form error alert */}
        {hasErrors && (
          <div role="alert" className="alert alert-error  mb-6">
            <AlertCircle className="h-6 w-6" />
            <div>
              <h4 className="font-bold">Please check the form</h4>
              <p className="text-sm">Some required Fields are missing.</p>
            </div>
          </div>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
              {/* Title*/}
               <label className="floating-label w-full">
                  <input 
                    type="text"
                    placeholder="Enter product title" 
                    className={`input w-full ${hasFieldError("title") ? "input-error" : ""}`}
                    {...form.register("title")}
                  />
                  <span>Product Title</span>
                  {hasFieldError("title") && (
                    <div className="text-xs text-error mt-1">
                      {getFieldErrorMessage("title")}
                    </div>
                  )}
                </label>
              {/* Price*/}
              <label className="floating-label w-full relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <span className="text-base-content">$</span>
                </div>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className={`input w-full pl-7 ${hasFieldError("price") ? "input-error" : ""}`}
                  {...form.register("price", {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                />
                <span>Price</span>
                {hasFieldError("price") && (
                  <div className="text-xs text-error mt-1">
                    {getFieldErrorMessage("price")}
                  </div>
                )}
              </label>
              </div>
                {/* Description*/}
              <label className="floating-label w-full">
                <textarea
                  placeholder="Enter product description"
                  className={`textarea h-24 w-full ${hasFieldError("description") ? "textarea-error" : ""}`}
                  {...form.register("description")}
                ></textarea>
                <span>Description</span>
                {hasFieldError("description") && (
                  <div className="text-xs text-error mt-1">
                    {getFieldErrorMessage("description")}
                  </div>
                )}
              </label>
                    {/* Brand*/}
                                  <div className="grid gap-6 md:grid-cols-2">
                                  <label className="floating-label w-full">
                      <input 
                        type="text" 
                        placeholder="Brand Name" 
                        className={`input w-full ${hasFieldError("brand") ? "input-error" : ""}`}
                        {...form.register("brand")}
                      />
                      <span>Brand</span>
                      {hasFieldError("brand") && (
                        <div className="text-xs text-error mt-1">
                          {getFieldErrorMessage("brand")}
                        </div>
                      )}
                    </label>

                 {/* SKU*/}
                 <label className="floating-label w-full">
                      <input 
                        type="text" 
                        placeholder="SKU CODE" 
                        className={`input w-full ${hasFieldError("sku") ? "input-error" : ""}`}
                        {...form.register("sku")}
                      />
                      <span>SKU</span>
                      {hasFieldError("sku") && (
                        <div className="text-xs text-error mt-1">
                          {getFieldErrorMessage("sku")}
                        </div>
                      )}
                    </label>
                  
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text mr-2 font-medium">On Sale</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      {...form.register("sale")}
                    />
                  </label>
                </div>

                {sale && (
                  <div className="form-control w-full md:w-1/3">
                    <label className="label">
                      <span className="label-text font-medium">Discount (%)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      className={`input  w-full ${hasFieldError("discount") ? "input-error" : ""}`}
                      {...form.register("discount", {
                        valueAsNumber: true,
                        setValueAs: (v) => (v === "" ? 0 : Number(v)),
                      })}
                    />
                    {hasFieldError("discount") && (
                      <label className="label">
                        <span className="label-text-alt text-error">{getFieldErrorMessage("discount")}</span>
                      </label>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button type="button" className="btn btn-primary" onClick={() => setActiveTab("inventory")}>
                  Next: Inventory
                </button>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Category</span>
                  </label>
                  <Select
                    options={CATEGORIES}
                    value={CATEGORIES.find((c) => c.value === form.watch("category"))}
                    onChange={(val) => form.setValue("category", val?.value || "")}
                    placeholder="Select category"
                    isDisabled={!isCustomizable && !!stockId}
                    classNamePrefix="react-select"
                    className={`${hasFieldError("category") ? "border-error border rounded" : ""}`}
                    formatOptionLabel={({ value, label, description }) => (
                      <div className="flex flex-col">
                        <div>{label}</div>
                        <div className="text-xs text-gray-500">{description}</div>
                      </div>
                    )}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: hasFieldError("category") ? "var(--error)" : base.borderColor,
                      }),
                    }}
                  />
                  {!isCustomizable && !!stockId && (
                    <div className="text-xs flex items-center mt-1 text-base-content opacity-70">
                      <Info className="h-3 w-3 mr-1" />
                      Category is determined by stock selection
                    </div>
                  )}
                  {hasFieldError("category") && (
                    <label className="label">
                      <span className="label-text-alt text-error">{getFieldErrorMessage("category")}</span>
                    </label>
                  )}
                </div>

                {!isCustomizable && (
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Select Stock</span>
                    </label>
                    <Select
                      options={stocks.map((stock) => ({
                        value: stock.stock_id,
                        label: stock.title,
                        data: stock,
                      }))}
                      value={
                        stockId
                          ? {
                              value: stockId,
                              label: stocks.find((s) => s.stock_id === stockId)?.title || "Unknown",
                            }
                          : null
                      }
                      onChange={(val) => {
                        form.setValue("stockId", val?.value || undefined);
                        handleStockChange(val);
                      }}
                      placeholder={loading ? "Loading stocks..." : "Select stock batch"}
                      isLoading={loading}
                      classNamePrefix="react-select"
                      className={`${hasFieldError("stockId") ? "border-error border rounded" : ""}`}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: hasFieldError("stockId") ? "var(--error)" : base.borderColor,
                        }),
                      }}
                    />
                    {hasFieldError("stockId") && (
                      <label className="label">
                        <span className="label-text-alt text-error">{getFieldErrorMessage("stockId")}</span>
                      </label>
                    )}
                  </div>
                )}
              </div>

              {selectedStock && !isCustomizable && (
                <div className="card bg-base-200 shadow-sm">
                  <div className="card-body p-4">
                    <h3 className="card-title text-sm mb-2">Selected Stock Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="stats shadow bg-base-100">
                        <div className="stat">
                          <div className="stat-title">Total Quantity</div>
                          <div className="stat-value text-lg">{selectedStock.totalQuantity}</div>
                        </div>
                      </div>
                      <div className="stats shadow bg-base-100">
                        <div className="stat">
                          <div className="stat-title">Available Quantity</div>
                          <div className="stat-value text-lg">{selectedStock.availableQuantity}</div>
                        </div>
                      </div>
                    </div>
                    <div className="divider my-1"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium mb-1">Available Sizes:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedStock.availableVariants.sizes.map((size: string, i: number) => (
                            <div key={`size-${i}`} className="badge badge-neutral badge-outline">
                              {size}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Available Colors:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedStock.availableVariants.colors.map((color: string, i: number) => (
                            <div key={`color-${i}`} className="badge badge-neutral badge-outline">
                              <div
                                className="h-3 w-3 rounded-full mr-1"
                                style={{
                                  backgroundColor: color.toLowerCase(),
                                  border: color.toLowerCase() === "white" ? "1px solid #ddd" : "none",
                                }}
                              />
                              {color}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(category === "Clothing" || category === "Shoes") && (
                <div className="form-control w-full">
                  <div className="flex items-center justify-between">
                    <label className="label">
                      <span className="label-text font-medium">Sizes</span>
                    </label>
                    {!isCustomizable && !!stockId && (
                      <div className="badge badge-outline badge-info">Auto-populated from stock</div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                    {(category === "Clothing" ? CLOTHING_SIZES : SHOE_SIZES).map((size) => (
                      <label
                        key={size}
                        className={`
                          flex items-center justify-center py-2 border rounded cursor-pointer
                          ${form.watch("sizes")?.includes(size) ? "bg-primary/10 border-primary text-primary" : "bg-base-100 border-base-300"}
                          ${!isCustomizable && !!stockId ? "opacity-70 cursor-not-allowed" : "hover:bg-base-200"}
                        `}
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm checkbox-primary mr-2"
                          checked={form.watch("sizes")?.includes(size)}
                          onChange={() => {
                            if (isCustomizable || !stockId) {
                              const sizes = form.watch("sizes") || [];
                              if (sizes.includes(size)) {
                                form.setValue("sizes", sizes.filter((s) => s !== size));
                              } else {
                                form.setValue("sizes", [...sizes, size]);
                              }
                            }
                          }}
                          disabled={!isCustomizable && !!stockId}
                        />
                        <span className="font-medium">{size}</span>
                      </label>
                    ))}
                  </div>
                  {hasFieldError("sizes") && (
                    <label className="label">
                      <span className="label-text-alt text-error">{getFieldErrorMessage("sizes")}</span>
                    </label>
                  )}
                </div>
              )}

              <div className="form-control w-full">
                <div className="flex items-center justify-between">
                  <label className="label">
                    <span className="label-text font-medium">Colors</span>
                  </label>
                  {!isCustomizable && !!stockId && (
                    <div className="badge badge-outline badge-info">Auto-populated from stock</div>
                  )}
                </div>
                <Select
                  isMulti
                  options={COLORS.map((c) => ({ value: c.hex, label: c.name }))}
                  value={form.watch("colors")}
                  onChange={(val: any) => form.setValue("colors", val)}
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
                  classNamePrefix="react-select"
                  className={`${hasFieldError("colors") ? "border-error border rounded" : ""}`}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: hasFieldError("colors") ? "var(--error)" : base.borderColor,
                    }),
                  }}
                />
                {hasFieldError("colors") && (
                  <label className="label">
                    <span className="label-text-alt text-error">{getFieldErrorMessage("colors")}</span>
                  </label>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button type="button" className="btn btn-outline" onClick={() => setActiveTab("basic")}>
                  Back
                </button>
                {!isCustomizable ? (
                  <button type="button" className="btn btn-primary" onClick={() => setActiveTab("images")}>
                    Next: Images
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      "Proceed to Store"
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === "images" && !isCustomizable && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["front_image", "back_image", "left_image", "right_image"].map((side) => (
                  <div key={side} className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium capitalize">{side.replace("_", " ")}</span>
                    </label>
                    {form.watch(side as keyof ProductFormValues) ? (
                      <div className="relative rounded-lg overflow-hidden bg-base-200 border border-base-300">
                        <div className="h-48 flex items-center justify-center">
                          <img
                            src={form.watch(side as keyof ProductFormValues) as string}
                            alt={side.replace("_", " ")}
                            className="h-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          className="btn btn-circle btn-error btn-sm absolute top-2 right-2"
                          onClick={() => form.setValue(side as keyof ProductFormValues, null)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-lg cursor-pointer hover:bg-base-200">
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          <div className="rounded-full bg-base-200 p-3 mb-2">
                            <Plus className="h-6 w-6 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Click to upload {side.replace("_", " ")}</p>
                          <p className="text-xs text-base-content opacity-70 mt-1">SVG, PNG, JPG or GIF</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSideImageUpload(side, e)}
                        />
                      </label>
                    )}
                    {hasFieldError(side as keyof ProductFormValues) && (
                      <label className="label">
                        <span className="label-text-alt text-error">{getFieldErrorMessage(side as keyof ProductFormValues)}</span>
                      </label>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <button type="button" className="btn btn-outline" onClick={() => setActiveTab("inventory")}>
                  Back
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Product"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        
      </div>
    </div>
  );
}