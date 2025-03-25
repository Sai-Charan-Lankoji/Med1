"use client";

import { useState } from "react";
import { Plus, X, Package } from "lucide-react";
import { useStock } from "@/app/hooks/useStock";

export function AddStockDialog({ open, onClose }) {
  const { standardProducts, addStock, loading, error } = useStock();
  const [stockData, setStockData] = useState({
    title: "Batch " + new Date().toISOString().slice(0, 10),
    category: "",
    stockType: "Standard",
    productId: "",
    hsnCode: "",
    gstPercentage: "",
    variants: [{ size: "", color: "", totalQuantity: "" }],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addStock({
        title: stockData.title,
        category: stockData.category,
        stockType: stockData.stockType,
        productId: stockData.stockType === "Standard" ? stockData.productId : null,
        hsnCode: stockData.hsnCode,
        gstPercentage: Number.parseFloat(stockData.gstPercentage),
        variants: stockData.variants.map((v) => ({
          size: v.size,
          color: v.color,
          totalQuantity: Number.parseInt(v.totalQuantity),
        })),
      });
      onClose();
    } catch (err) {
      console.error("Failed to add stock:", err);
    }
  };

  const addVariant = () => {
    setStockData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", color: "", totalQuantity: "" }],
    }));
  };

  const removeVariant = (index) => {
    if (stockData.variants.length > 1) {
      setStockData((prev) => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      }));
    }
  };

  const updateVariant = (index, field, value) => {
    setStockData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }));
  };

  return (
    <div className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box w-11/12 max-w-3xl bg-base-100 shadow-xl rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-base-200">
          <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <Package className="w-5 h-5" /> Add New Stock
          </h2>
          <button
            className="btn btn-ghost btn-circle text-base-content hover:bg-base-200"
            onClick={onClose}
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Batch Title */}
            <div className="form-control">
              <label htmlFor="title" className="label">
                <span className="label-text font-medium">Batch Title</span>
              </label>
              <input
                id="title"
                type="text"
                value={stockData.title}
                onChange={(e) => setStockData({ ...stockData, title: e.target.value })}
                className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={loading}
                required
              />
            </div>

            {/* Product Category */}
            <div className="form-control">
              <label htmlFor="category" className="label">
                <span className="label-text font-medium">Product Category</span>
              </label>
              <select
                id="category"
                value={stockData.category}
                onChange={(e) => setStockData({ ...stockData, category: e.target.value })}
                className="select select-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={loading}
                required
              >
                <option value="">Select Category</option>
                <option value="Garments">Garments</option>
                <option value="Fabrics">Fabrics</option>
                <option value="Accessories">Accessories</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Stock Type */}
            <div className="form-control">
              <label htmlFor="stockType" className="label">
                <span className="label-text font-medium">Stock Type</span>
              </label>
              <select
                id="stockType"
                value={stockData.stockType}
                onChange={(e) => setStockData({ ...stockData, stockType: e.target.value })}
                className="select select-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={loading}
                required
              >
                <option value="Standard">Standard Product</option>
                <option value="Designable">Designable Product</option>
              </select>
            </div>

            {/* Product Selection (for Standard Type) */}
            {stockData.stockType === "Standard" && (
              <div className="form-control">
                <label htmlFor="productId" className="label">
                  <span className="label-text font-medium">Product</span>
                </label>
                <select
                  id="productId"
                  value={stockData.productId}
                  onChange={(e) => setStockData({ ...stockData, productId: e.target.value })}
                  className="select select-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={loading}
                  required
                >
                  <option value="">Select product</option>
                  {standardProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title} ({product.sku})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* HSN Code */}
            <div className="form-control">
              <label htmlFor="hsnCode" className="label">
                <span className="label-text font-medium">HSN Code</span>
              </label>
              <input
                id="hsnCode"
                type="text"
                value={stockData.hsnCode}
                onChange={(e) => setStockData({ ...stockData, hsnCode: e.target.value })}
                className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={loading}
                required
                placeholder="e.g., 6205"
              />
            </div>

            {/* GST Percentage */}
            <div className="form-control">
              <label htmlFor="gstPercentage" className="label">
                <span className="label-text font-medium">GST Percentage (%)</span>
              </label>
              <input
                id="gstPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={stockData.gstPercentage}
                onChange={(e) => setStockData({ ...stockData, gstPercentage: e.target.value })}
                className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                disabled={loading}
                required
                placeholder="e.g., 12"
              />
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-base-content">Variants</span>
              <span className="badge badge-outline badge-sm">
                {stockData.variants.length} {stockData.variants.length === 1 ? "variant" : "variants"}
              </span>
            </div>

            <div className="card bg-base-100 border border-base-200 shadow-sm rounded-xl">
              <div className="card-body p-4 space-y-4">
                {stockData.variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
                    {/* Size */}
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text text-xs">Size</span>
                      </label>
                      <select
                        value={variant.size}
                        onChange={(e) => updateVariant(index, "size", e.target.value)}
                        className="select select-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        disabled={loading}
                        required
                      >
                        <option value="">Size</option>
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                        <option value="XL">Extra Large</option>
                      </select>
                    </div>

                    {/* Color */}
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text text-xs">Color</span>
                      </label>
                      <select
                        value={variant.color}
                        onChange={(e) => updateVariant(index, "color", e.target.value)}
                        className="select select-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        disabled={loading}
                        required
                      >
                        <option value="">Color</option>
                        <option value="black">Black</option>
                        <option value="white">White</option>
                        <option value="navy">Navy</option>
                        <option value="gray">Gray</option>
                        <option value="blue">Blue</option>
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text text-xs">Quantity</span>
                      </label>
                      <input
                        type="number"
                        value={variant.totalQuantity}
                        onChange={(e) => updateVariant(index, "totalQuantity", e.target.value)}
                        className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        disabled={loading}
                        min="0"
                        required
                      />
                    </div>

                    {/* Remove Button */}
                    <div className="md:flex md:justify-end">
                      <button
                        type="button"
                        className="btn btn-ghost btn-circle text-base-content hover:text-error hover:bg-error/10"
                        onClick={() => removeVariant(index)}
                        disabled={stockData.variants.length === 1 || loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Variant Button */}
                <button
                  type="button"
                  onClick={addVariant}
                  className="btn btn-outline btn-block border-dashed border-base-300 text-base-content hover:bg-base-200"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error shadow-md">
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="btn btn-outline btn-sm text-base-content hover:bg-base-200"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Add Stock"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}