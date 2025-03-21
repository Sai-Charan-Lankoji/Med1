"use client";

import { useGetProduct } from "@/app/hooks/products/useGetProduct";
import { useUpdateProduct } from "@/app/hooks/products/useUpdateProduct";
import { countries } from "@/app/utils/countries";
import { MoreHorizontal, Pencil, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

interface ProductUpdateData {
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  hs_code?: string;
  origin_country?: string;
  mid_code?: string;
  [key: string]: any;
}

const Attributes = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
  const { data: product, isLoading: isProductLoading, error: productError } = useGetProduct(id as string);
  const { updateProduct, isLoading: isUpdating, error: updateError } = useUpdateProduct(id as string);
  const [productFormData, setProductFormData] = useState<ProductUpdateData>({});

  useEffect(() => {
    if (product) {
      setProductFormData({
        weight: product.weight || 0,
        length: product.length || 0,
        height: product.height || 0,
        width: product.width || 0,
        hs_code: product.hs_code || "",
        origin_country: product.origin_country || "",
        mid_code: product.mid_code || "",
      });
    }
  }, [product]);

  const openAttributeModal = () => setIsAttributeModalOpen(true);
  const closeAttributeModal = () => setIsAttributeModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct(productFormData);
      toast.success("Product updated successfully", { duration: 1000 });
      setTimeout(() => {
        router.push("/vendor/products");
      }, 2000);
    } catch (error) {
      toast.error("Failed to update product", { duration: 1000 });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = ["weight", "length", "height", "width"].includes(name) ? parseFloat(value) || 0 : value;
    setProductFormData((prevData) => ({
      ...prevData,
      [name]: parsedValue,
    }));
  };

  const renderInputField = (
    id: string,
    label: string,
    placeholder: string,
    type: "text" | "number" = "text",
    required = false,
    value: string | number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div className="form-control">
      <label htmlFor={id} className="label">
        <span className="label-text">
          {label} {required && <span className="text-error">*</span>}
        </span>
      </label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input input-bordered w-full bg-base-100 text-base-content placeholder-base-content/70"
        required={required}
      />
    </div>
  );

  if (isProductLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-error shadow-lg">
          <span>Error loading product data</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="alert alert-warning shadow-lg">
          <span>Product not found</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="p-6 mt-4 bg-base-100 shadow-md rounded-lg sm:w-[398px] md:w-[532px] lg:w-[800px]">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-semibold mb-2 text-base-content">Attributes</h2>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <MoreHorizontal className="w-6 h-6 text-base-content/70" />
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <button onClick={openAttributeModal} className="flex items-center">
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit Attributes</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {isAttributeModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-lg bg-base-100">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-semibold mb-4 text-base-content">Edit Attributes</h2>
                <button onClick={closeAttributeModal} className="btn btn-ghost btn-circle">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <hr className="my-4 border-base-300" />
              {isUpdating && (
                <div className="flex justify-center mb-4">
                  <span className="loading loading-spinner text-primary"></span>
                </div>
              )}
              {updateError && (
                <div className="alert alert-error shadow-lg mb-4">
                  <span>Failed to update product</span>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <h3 className="font-semibold text-lg text-base-content pt-4">Dimensions</h3>
                <p className="text-sm text-base-content/70">Configure to calculate the most accurate shipping rates</p>
                <div className="grid grid-cols-4 gap-4 my-4">
                  {renderInputField("width", "Width", "0", "number", false, productFormData.width || 0, handleInputChange)}
                  {renderInputField("length", "Length", "0", "number", false, productFormData.length || 0, handleInputChange)}
                  {renderInputField("height", "Height", "0", "number", false, productFormData.height || 0, handleInputChange)}
                  {renderInputField("weight", "Weight", "0", "number", false, productFormData.weight || 0, handleInputChange)}
                </div>
                <h3 className="font-semibold text-lg text-base-content pt-4">Customs</h3>
                <p className="text-sm text-base-content/70 mb-4">Configure to calculate the most accurate shipping rates</p>
                <div className="grid grid-cols-2 gap-4">
                  {renderInputField("mid_code", "MID Code", "123456", "number", false, productFormData.mid_code || "", handleInputChange)}
                  {renderInputField("hs_code", "HS Code", "654321", "number", false, productFormData.hs_code || "", handleInputChange)}
                </div>
                <div className="form-control w-52 mt-4">
                  <label htmlFor="origin_country" className="label">
                    <span className="label-text">Country</span>
                  </label>
                  <select
                    id="origin_country"
                    name="origin_country"
                    className="select select-bordered w-full bg-base-100 text-base-content"
                    value={productFormData.origin_country || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="button" className="btn btn-ghost" onClick={closeAttributeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary ml-2" disabled={isUpdating}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h3 className="text-lg font-semibold mt-4 text-base-content">Dimensions</h3>
        <div className="grid grid-cols-1 gap-1 mt-2">
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-base-content/70">Height:</p>
            <p className="text-[14px] text-base-content pr-6">{productFormData.height || "-"}</p>
          </div>
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-base-content/70">Width:</p>
            <p className="text-[14px] text-base-content pr-6">{productFormData.width || "-"}</p>
          </div>
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-base-content/70">Length:</p>
            <p className="text-[14px] text-base-content pr-6">{productFormData.length || "-"}</p>
          </div>
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-base-content/70">Weight:</p>
            <p className="text-[14px] text-base-content pr-6">{productFormData.weight || "-"}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-4 text-base-content">Customs</h3>
        <div className="grid grid-cols-1 gap-1 mt-2">
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-base-content/70">MID Code:</p>
            <p className="text-[14px] text-base-content pr-6">{productFormData.mid_code || "-"}</p>
          </div>
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-base-content/70">HS Code:</p>
            <p className="text-[14px] text-base-content pr-6">{productFormData.hs_code || "-"}</p>
          </div>
          <div className="mb-2 flex flex-row justify-between">
            <p className="text-[14px] font-normal text-base-content/70">Country of origin:</p>
            <p className="text-[14px] text-base-content pr-6">{productFormData.origin_country || "-"}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attributes;